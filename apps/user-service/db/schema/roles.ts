import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import { sql } from 'drizzle-orm'
import * as p from 'drizzle-orm/pg-core'

import { authSchema } from './schema'

export const roles = authSchema.table(
    'roles',
    {
        id: p
            .uuid('id')
            .primaryKey()
            .default(sql`uuidv7()`),
        name: p.varchar('name', { length: 50 }).notNull().unique(),
        display: p.varchar('display', { length: 100 }).notNull(),
        inherits: p
            .uuid('inherits')
            .references((): AnyPgColumn => roles.id, { onDelete: 'set null' }),
        createdAt: p.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: p.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    t => [
        p.index('idx_roles_inherits').on(t.inherits),
        p.uniqueIndex('idx_roles_name_unique').on(t.name),
    ],
)

export type RoleRow = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
