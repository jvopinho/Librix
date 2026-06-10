import { UserFeatures } from '@librix/flags'
import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { AppRequest, AppResponse, AuthenticatedRequest } from '@/@types/express'
import { User } from '@/database/sequelize/user'
import { env } from '@/env'

interface AuthMiddlewareOptions {
  onlyAuthenticated?: boolean
  features?: Parameters<UserFeatures['has']>
}

export function isAuthenticated(req: AppRequest): req is AuthenticatedRequest {
  return req.isAuthenticated()
}

async function authenticate(authHeader: string): Promise<[true, User] | [false, { status: number, message: string }]> {
  if(!authHeader) {
    return [false, { 
      status: 401, 
      message: 'Credenciais de autenticação não fornecidas', 
    }]
  }

  let token: { user_id: number }

  try {
    token = jwt.verify(authHeader, env.SESSION_JWT_SECRET) as typeof token
  } catch (err) {
    return [false, { 
      status: 401, 
      message: 'Credenciais de autenticação inválidas', 
    }]
  }

  const user = await User.findByPk(token.user_id)

  if(!user) {
    return [false, { 
      status: 401, 
      message: 'Usuário não encontrado', 
    }]
  }

  return [true, user]
}

export function AuthMiddleware({ onlyAuthenticated = true, features }: AuthMiddlewareOptions = {}) {
  if(features && !onlyAuthenticated) {
    throw new Error('Invalid AuthMiddleware configuration: features cannot be true if onlyAuthenticated is false')
  }
  
  return (_this: any, methodName: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: AppRequest, res: AppResponse, next: NextFunction) {
      const authHeader = req.headers['authorization']

      const [authenticated, result] = await authenticate(authHeader!)

      if(!authenticated && onlyAuthenticated) {
        const { status, message } = result

        return res.status(status).json({ message })
      }

      const user = result as User

      req.isAuthenticated = () => authenticated as true
      
      if(user instanceof User) {
        req.getUser = () => user
      }

      if(features) {
        const [feature] = features

        const userFeatures = new UserFeatures(user.features)

        if(!userFeatures.has(feature)) {
          return res.status(403).json({ message: 'Você não tem permissão para acessar este recurso' })
        }
      }

      return originalMethod.call(this, req, res, next)
    }
  }
}

