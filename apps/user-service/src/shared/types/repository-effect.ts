import { DatabaseError } from '@shared/errors/database.error'
import { Effect } from 'effect'

export type RepositoryEffect<T> = Effect.Effect<T, DatabaseError>
