import vine from '@vinejs/vine'

import { numericString } from './util.validator'

export const paginationSchema = vine.object({
    search: vine.string().nullable().optional(),
    limit: numericString(10),
    offset: numericString(1),
})
