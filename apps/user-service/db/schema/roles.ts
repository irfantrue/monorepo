import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import { sql } from 'drizzle-orm'
import * as p from 'drizzle-orm/pg-core'

import { authSchema } from './schema'

export const roles = authSchema.table(
    'roles',
    {
        id: p
            .uuid()
            .primaryKey()
            .default(sql`uuidv7()`),
        name: p.varchar({ length: 50 }).notNull().unique(),
        display: p.varchar({ length: 100 }).notNull(),
        inherits: p.uuid().references((): AnyPgColumn => roles.id, { onDelete: 'set null' }),
        createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    t => [
        p.index('idx_roles_inherits').on(t.inherits),
        p.uniqueIndex('idx_roles_name_unique').on(t.name),
    ],
)

export type RoleRow = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
