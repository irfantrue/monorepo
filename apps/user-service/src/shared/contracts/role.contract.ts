import type { Infer } from '@vinejs/vine/types'

import vine from '@vinejs/vine'

export const createRoleSchema = vine.create({
    name: vine.string().minLength(1).maxLength(50),
    display: vine.string().minLength(1).maxLength(100),
    inherits: vine
        .string()
        .uuid({ version: [7] })
        .nullable()
        .optional(),
})

export type CreateRoleDto = Infer<typeof createRoleSchema>
