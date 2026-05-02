import { sql } from 'drizzle-orm'
import * as p from 'drizzle-orm/pg-core'

import { authSchema } from './schema'

export const permissions = authSchema.table(
    'permissions',
    {
        id: p
            .uuid()
            .primaryKey()
            .default(sql`uuidv7()`),
        name: p.varchar({ length: 100 }).notNull(),
        resource: p.varchar({ length: 50 }).notNull(),
        action: p.varchar({ length: 50 }).notNull(),
        description: p.varchar({ length: 255 }),
        category: p.varchar({ length: 50 }),
        isActive: p.boolean().notNull().default(true),
        createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    t => [
        p.uniqueIndex('idx_permissions_name').on(t.name),
        p.uniqueIndex('idx_permissions_resource_action').on(t.resource, t.action),
        p.index('idx_permissions_category').on(t.category),
        p.index('idx_permissions_is_active').on(t.isActive),
    ],
)

export type PermissionRow = typeof permissions.$inferSelect
export type NewPermission = typeof permissions.$inferInsert
