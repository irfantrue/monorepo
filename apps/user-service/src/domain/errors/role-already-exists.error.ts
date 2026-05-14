import { BaseError, BaseErrorOptions } from '@shared/errors/base.error'

export class RoleAlreadyExistError extends BaseError {
    constructor(options?: Omit<BaseErrorOptions, 'code' | 'statusCode'>) {
        super(`Role already exist "${options?.context?.name ?? ''}"`, {
            ...options,
            code: 'ROLE_ALREADY_EXIST_ERROR',
            statusCode: 409,
        })
    }
}
