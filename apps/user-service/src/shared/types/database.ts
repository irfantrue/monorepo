import { db } from '@infrastructure/db'

export type Database = typeof db
export type TransactionOf<T> = T extends { transaction: (cb: (tx: infer TX) => any) => any }
    ? TX
    : never
export type Tx = TransactionOf<typeof db>
