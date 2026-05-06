import { BaseError, BaseErrorOptions } from './base.error'

export class DatabaseError extends BaseError {
    constructor(options?: Omit<BaseErrorOptions, 'code' | 'statusCode'>) {
        super('Database operation failed', { ...options, code: 'DATABASE_ERROR', statusCode: 500 })
    }
}
