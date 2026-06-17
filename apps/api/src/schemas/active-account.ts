import z from 'zod'

export const ActivateAccountBody = z.object({
  token: z.string(),
  password: z.string().min(4, 'A senha deve conter no mínimo 4 caracteres'),
})
export type ActivateAccountBody = z.infer<typeof ActivateAccountBody>