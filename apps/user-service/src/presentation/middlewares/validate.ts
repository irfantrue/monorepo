import { ValidationError } from '@domain/errors/validation.error'
import { sValidator } from '@hono/standard-validator'
import { StandardSchemaV1 } from '@standard-schema/spec'

type Target = 'json' | 'query'

export const validate = <S extends StandardSchemaV1<any>>(target: Target, schema: S) => {
    return sValidator(target, schema, result => {
        if (!result.success) {
            throw new ValidationError({
                context: {
                    issues: result.error,
                },
            })
        }
    })
}
