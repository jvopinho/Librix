import z from 'zod'

export const CreateUserBody = z.object({
  name: z.string().min(2, 'O nome deve conter no mínimo 2 caracteres'),
  email: z.email('Email inválido'),
})
export type CreateUserBody = z.infer<typeof CreateUserBody>