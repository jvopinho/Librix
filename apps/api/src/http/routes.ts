import { Application, Express, Router } from 'express'

import { UsersController } from '@/controllers/users-controller'
import { uploadMiddleware } from '@/middleware/upload-middleware'
import { AuthController } from '@/controllers/auth-controller'

export const setupRoutes = (app: Express) => {
  const usersRouter = Router()
  const usersController = new UsersController()

  usersRouter.post('/', usersController.createUser.bind(usersController) as Application)
  usersRouter.get('/', usersController.listUsers.bind(usersController) as Application)
  usersRouter.get('/@me', usersController.getCurrentUser.bind(usersController) as Application)
  usersRouter.patch('/:id', usersController.editUser.bind(usersController) as Application)
  usersRouter.delete('/:id', usersController.deleteUser.bind(usersController) as Application)

  usersRouter.head('/verify_activation_token', usersController.verifyActivationToken.bind(usersController) as Application)
  usersRouter.post('/activate_account', uploadMiddleware.single('avatar'), usersController.activateAccount.bind(usersController) as Application)

  const authRouter = Router()
  const authController = new AuthController()

  authRouter.post('/sign-in', authController.signIn.bind(authController) as Application)
  
  app
    .use('/users', usersRouter)
    .use('/auth', authRouter)
}