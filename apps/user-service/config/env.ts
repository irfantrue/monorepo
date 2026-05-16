import { baseEnvSchema } from '@repo/config'
import vine from '@vinejs/vine'

const envSchema = vine.create({
    ...baseEnvSchema.getProperties(),
    SERVICE_NAME: vine.string().parse(value => value ?? 'user-service'),

    // PostgreSQL
    POSTGRES_HOST: vine.string().parse(value => value ?? 'localhost'),
    POSTGRES_USER: vine.string().minLength(1),
    POSTGRES_PASS: vine.string().minLength(1),
    POSTGRES_DB: vine.string().minLength(1),
})

const [error, result] = await envSchema.tryValidate(Bun.env)

if (error) {
    console.error('Invalid environment variables:')
    console.error(error.messages)
    process.exit(1)
}

export const env = result
export type Env = typeof env
