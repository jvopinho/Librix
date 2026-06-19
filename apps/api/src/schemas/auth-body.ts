import z from "zod";

export const LoginBody = z.object({
    email: z.email(),
    password: z.string().min(4, 'A senha deve conter no mínimo 4 caracteres'),
})
export type LoginBody = z.infer<typeof LoginBody>