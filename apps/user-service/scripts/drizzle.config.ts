import 'dotenv/config'

import { env } from '@config/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './db/schema/*',
    out: './db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.POSTGRES_URL,
    },
    verbose: true,
    strict: true,
    casing: 'snake_case',
})
