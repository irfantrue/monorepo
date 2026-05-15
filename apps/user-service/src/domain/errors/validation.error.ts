import { BaseError, BaseErrorOptions } from '@shared/errors/base.error'
import { StandardSchemaV1 } from '@standard-schema/spec'

interface ValidationErrorContext {
    issues: StandardSchemaV1.Issue
}

export class ValidationError extends BaseError<ValidationErrorContext> {
    constructor(options?: Omit<BaseErrorOptions, 'code' | 'statusCode'>) {
        super('Validation Error', {
            ...options,
            code: 'VALIDATION_ERROR',
            statusCode: 422,
        })
    }
}
