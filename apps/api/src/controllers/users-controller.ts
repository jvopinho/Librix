import { randomBytes } from 'node:crypto'

import bcrypt from 'bcrypt'
import { Resend } from 'resend'

import { AppRequest, AppResponse, AuthenticatedRequest } from '@/@types/express'
import { Invitation } from '@/database/sequelize/invitation'
import { User } from '@/database/sequelize/user'
import { env } from '@/env'
// import { AuthMiddleware } from '@/middleware/auth-middleware'
import { BodyMiddleware } from '@/middleware/body-middleware'
import { ActivateAccountBody } from '@/schemas/active-account'
import { CreateUserBody } from '@/schemas/create-user'
import { APIUser } from '@librix/types'
import { EditUserBody } from '@/schemas/edit-user'
import { Op } from 'sequelize'
import { UserFeatures, UserFeaturesByRole } from '@librix/flags'
import { AuthMiddleware } from '@/middleware/auth-middleware'

export class UsersController {
  // @AuthMiddleware({ features: ['create:users'] })
  @BodyMiddleware(CreateUserBody)
  async createUser(req: AuthenticatedRequest, res: AppResponse) {
    const body = req.body as CreateUserBody

    const emailExists = await User.findOne({
      where: {
        email: body.email,
      },
    })

    if (emailExists) {
      return res.status(400).json({
        message: 'Email já está em uso',
      })
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      features: UserFeatures.resolve('read:activation_token'),
      passwordHash: null,
    })

    const invitation = await Invitation.create({
      userId: user.id,
      token: randomBytes(32).toString('hex'),
    })


    const userNameURI = encodeURIComponent(user.name)

    const activationLink = `${env.WEB_URL.replace(/\/$/, '')}/users/activate?token=${invitation.token}&name=${userNameURI}`

    const resend = new Resend(env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Librix <librix@nguys.tech>',
      to: [body.email],
      subject: 'hello world',
      html: `
          <p>Você foi convidado para se juntar ao Librix. Clique no link abaixo para definir sua senha e acessar sua conta:</p>
          <p><a href="${activationLink}" style="text-decoration: none; background-color: #007bff; color: #fff; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Ativar Conta</a></p>
        `,
    })

    return res.status(201).json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      actived: false,
    } satisfies APIUser)
  }

  async listUsers(req: AppRequest, res: AppResponse) {
    const usersData = await User.findAll()

    const users: APIUser[] = usersData.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      actived: !!user.passwordHash,
    }))

    return res.status(200).json(users satisfies APIUser[])
  }

  @AuthMiddleware()
  async getCurrentUser(req: AuthenticatedRequest, res: AppResponse) {
    const user = req.getUser()

    return res.status(200).json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      actived: !!user.passwordHash,
    } satisfies APIUser)
  }

  @BodyMiddleware(EditUserBody)
  async editUser(req: AppRequest, res: AppResponse) {
    const body = req.body as EditUserBody
    const { id } = req.params as { id: string }

    const user = await User.findByPk(parseInt(id))

    if(!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      })
    }

    if(body.email) {
      const emailExists = await User.findOne({
        where: {
          email: body.email,
          id: {
            [Op.ne]: parseInt(id),
          },
        },
      })

      if (emailExists) {
        return res.status(400).json({
          message: 'Email já está em uso',
        })
      }
    }

    await user.update({
      name: body.name ?? user.name,
      email: body.email ?? user.email,
    })

    return res.status(200).json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      actived: !!user.passwordHash,
    } satisfies APIUser)
  }

  async deleteUser(req: AppRequest, res: AppResponse) {
    const { id } = req.params as { id: string }

    const user = await User.findByPk(parseInt(id))

    if(!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      })
    }

    await user.destroy()

    Invitation.destroy({
      where: {
        userId: parseInt(id),
      }
    })

    return res.status(204).send()
  }

  async verifyActivationToken(req: AppRequest, res: AppResponse) {
    const token = req.query.token as string

    if(!token) {
      return res.status(400).json({
        message: 'O parâmetro "token" é obrigatório',
      })
    }

    const invitation = await Invitation.findOne({
      where: {
        token,
      },
    })

    if(!invitation) {
      return res.status(404).json({
        message: 'O convite é inválido ou expirou',
      })
    }

    const user = await User.findByPk(invitation.userId)

    if(!user) {
      return res.status(404).json({
        message: 'Usuário não existe',
      })
    }

    const features = new UserFeatures(BigInt(user.features))

    if(!features.has('read:activation_token')) {
      return res.status(403).json({
        message: 'Você não tem permissão para acessar este recurso',
      })
    }

    return res.sendStatus(200)
  }

  @BodyMiddleware(ActivateAccountBody)
  async activateAccount(req: AppRequest, res: AppResponse) {
    const body = req.body as ActivateAccountBody
    const file = req.file

    console.log('body: ', body)
    console.log('file: ', file)

    const invitation = await Invitation.findOne({
      where: {
        token: body.token,
      },
    })

    if(!invitation) {
      return res.status(404).json({
        message: 'Token inválido',
      })
    }

    const user = await User.findByPk(invitation.userId)

    if(!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      })
    }

    const features = new UserFeatures(BigInt(user.features))

    if(!features.has('read:activation_token')) {
      return res.status(403).json({
        message: 'Você não tem permissão para acessar este recurso',
      })
    }

    const passwordHash = await bcrypt.hash(body.password, env.PASSWORD_SALT_ROUNDS)

    features.remove('read:activation_token')

    features.add(UserFeaturesByRole.COMMON)

    await user.update({
      passwordHash,
      features: features.bits,
      avatar: file ? file.filename : null
    })

    await invitation.destroy()

    return res.status(200).json({
      message: 'Conta ativada com sucesso',
    })
  }
}