import z from "zod";

export const EditUserBody = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').optional(),
    email: z.email('O email deve ser válido').optional(),
})
export type EditUserBody = z.infer<typeof EditUserBody>