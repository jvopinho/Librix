import { AppResponse, AuthenticatedRequest } from '@/@types/express'
import { AuthMiddleware } from '@/middleware/auth-middleware'

export class UsersController {
  @AuthMiddleware({ features: ['create:users'] })
  async createUser(req: AuthenticatedRequest, res: AppResponse) {
    
  }
}