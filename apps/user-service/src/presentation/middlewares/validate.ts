import { ValidationError } from '@domain/errors/validation.error'
import { sValidator } from '@hono/standard-validator'
import { StandardSchemaV1 } from '@standard-schema/spec'

export const validate = <T>(schema: StandardSchemaV1<T>) => {
    return sValidator('json', schema, result => {
        if (!result.success) {
            throw new ValidationError({
                context: {
                    issues: result.error,
                },
            })
        }
    })
}
