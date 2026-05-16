import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const baseEnvSchema = vine.object({
    NODE_ENV: vine.enum(['development', 'production']),
    SERVICE_NAME: vine.string().minLength(1),
    LOG_LEVEL: vine.enum(['error', 'warn', 'info', 'debug']),
    LOG_FORMAT: vine.enum(['json', 'pretty']),
    PORT: vine.number(),
    SHUTDOWN_TIMEOUT: vine.number(),
})

export type BaseEnv = Infer<typeof baseEnvSchema>
