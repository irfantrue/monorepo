import 'dotenv/config'

import { env } from '@config/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './db/schema/**/*.ts',
    out: './db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.POSTGRES_URL,
    },
    migrations: {
        table: 'journal',
        schema: 'drizzle',
    },
    schemaFilter: 'auth',
    verbose: true,
    strict: true,
    casing: 'snake_case',
})
