import type { Infer } from '@vinejs/vine/types'

import { FilterRoleDto } from '@application/dtos/role.dto'
import vine from '@vinejs/vine'

import { paginationSchema } from './pagination.validator'
import { booleanString } from './util.validator'

export const createRoleValidator = vine.create({
    name: vine.string().minLength(1).maxLength(50),
    display: vine.string().minLength(1).maxLength(100),
    inherits: vine
        .string()
        .uuid({ version: [7] })
        .nullable()
        .optional(),
})

export const roleListValidator = vine.create({
    ...paginationSchema.getProperties(),
    hasPermissions: booleanString(false),
})

type Ensure<TExpected, TActual extends TExpected> = true

type _FilterRoleValidatorMatchesDto = Ensure<FilterRoleDto, Infer<typeof roleListValidator>>
