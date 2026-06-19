import { AppRequest, AppResponse } from "@/@types/express";
import { User } from "@/database/sequelize/user";
import { env } from "@/env";
import { BodyMiddleware } from "@/middleware/body-middleware";
import { LoginBody } from "@/schemas/auth-body";
import { UserFeatures } from "@librix/flags";
import { compare } from "bcrypt";

import jwt from 'jsonwebtoken'

export class AuthController {
    @BodyMiddleware(LoginBody)
    async signIn(req: AppRequest, res: AppResponse) {
        const body = req.body as LoginBody

        const user = await User.findOne({
            where: {
                email: body.email,
            },
        })

        if(!user || !user.passwordHash) {
            return res.status(401).json({
                message: 'Email ou senha inválidos',
            })
        }

        const passwordMatch = await compare(body.password, user.passwordHash)

        if(!passwordMatch) {
            return res.status(401).json({
                message: 'Email ou senha inválidos',
            })
        }

        const features = new UserFeatures(BigInt(user.features))

        if (!features.has('create:session')) {
            return res.status(403).json({
                message: 'Você ainda não ativou sua conta. Verifique seu email para ativar.',
            })
        }

        const token = jwt.sign({
            user_id: user.id,
            features: user.features,
        }, env.JWT_SESSION_SECRET, {
            expiresIn: 2 * 60 * 60, // 2 horas
        })

        return res.status(200).json({
            session_token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                features: user.features,
            },
        })
    }
}