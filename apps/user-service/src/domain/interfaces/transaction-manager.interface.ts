import { Tx } from '@shared/types/database'

export interface ITransactionManager {
    transaction<A>(fn: (tx: Tx) => Promise<A>): Promise<A>
}
