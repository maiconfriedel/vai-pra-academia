import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).url(),
  JWT_TOKEN_SECRET: z.string().min(1),
})

export const env = envSchema.parse(process.env)
