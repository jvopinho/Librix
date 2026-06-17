import z from 'zod'

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'local'])
    .default('local'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3000),
  DEBUG: z.coerce.boolean().default(true),

  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('password'),
  POSTGRES_DB: z.string().default('postgres'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_ENDPOINT: z.string().default('localhost:5432'),

  RESEND_API_KEY: z.string(),

  JWT_SESSION_SECRET: z.string(),
  JWT_FIRST_ACCESS_SECRET: z.string(),
  PASSWORD_SALT_ROUNDS: z.coerce.number().default(10),

  WEB_URL: z.string().default('http://localhost:5173'),
})
export type EnvSchema = z.infer<typeof EnvSchema>