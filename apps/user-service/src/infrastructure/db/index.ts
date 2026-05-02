import { env } from '@config/env'
import { relations } from '@db/schema/relations'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'

// Bun SQL has built-in connection pooling
const client = new SQL({
    host: env.POSTGRES_HOST,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASS,
    database: env.POSTGRES_DB,
    max: 20,
    idleTimeout: 30,
    maxLifetime: 3600,
    connectionTimeout: 10,
})

export const db = drizzle({ client, jit: true, relations })
