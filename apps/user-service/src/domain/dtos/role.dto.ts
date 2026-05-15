import { z } from 'zod'

export const createRoleSchema = z.object({
    name: z.string().min(1).max(50),
    display: z.string().min(1).max(100),
    inherits: z.uuidv7().optional(),
})

export type CreateRoleDto = z.infer<typeof createRoleSchema>
