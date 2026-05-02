import { baseEnvSchema } from '@repo/config'
import { z } from 'zod'

const envSchema = baseEnvSchema.extend({
    SERVICE_NAME: z.literal('user-service').default('user-service'),

    // PostgreSQL
    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASS: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
})

const parsedEnv = envSchema.safeParse(Bun.env)

if (!parsedEnv.success) {
    console.error('Invalid environment variables:')
    console.error(parsedEnv.error.issues)
    process.exit(1)
}

export const env = parsedEnv.data
export type Env = typeof env
