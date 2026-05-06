import { env } from '@config/env'
import { relations } from '@db/schema/relations'
import { DatabaseError } from '@shared/errors/database.error'
import { TransactionEffect, Tx } from '@shared/types/database'
import { SQL } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sql'
import { Effect } from 'effect'

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
export type Db = typeof db

export class Database {
    constructor(private readonly db: Db) {}

    transaction<A>(fn: (tx: Tx) => TransactionEffect<A>): TransactionEffect<A> {
        return Effect.tryPromise({
            try: () => {
                return this.db.transaction(tx => Effect.runPromise(fn(tx)))
            },
            catch: error => {
                return new DatabaseError({ cause: error instanceof Error ? error : undefined })
            },
        })
    }
}
