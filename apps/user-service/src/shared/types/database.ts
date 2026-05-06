import { db } from '@infrastructure/db'
import { DatabaseError } from '@shared/errors/database.error'
import { Effect } from 'effect'

export type TransactionOf<T> = T extends { transaction: (cb: (tx: infer TX) => any) => any }
    ? TX
    : never
export type Tx = TransactionOf<typeof db>
export type TransactionEffect<A> = Effect.Effect<A, DatabaseError>
