import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import { sql } from 'drizzle-orm'
import * as p from 'drizzle-orm/pg-core'

import { roles } from './roles'
import { authSchema } from './schema'

// citext extension for case-insensitive text (email)
const citext = p.customType<{ data: string }>({
    dataType() {
        return 'citext'
    },
})

export const users = authSchema.table(
    'users',
    {
        id: p
            .uuid()
            .primaryKey()
            .default(sql`uuidv7()`),
        name: p.varchar({ length: 100 }).notNull(),
        email: citext().notNull(),
        passwordHash: p.varchar({ length: 255 }).notNull(),
        roleId: p.uuid().references((): AnyPgColumn => roles.id, { onDelete: 'set null' }),
        isActive: p.boolean().notNull().default(true),
        isVerified: p.boolean().notNull().default(false),
        createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
        lastLoginAt: p.timestamp({ withTimezone: true }),
        emailVerifiedAt: p.timestamp({ withTimezone: true }),
        passwordChangedAt: p.timestamp({ withTimezone: true }),
    },
    t => [
        p.uniqueIndex('idx_users_email').on(t.email),
        p.index('idx_users_role_id').on(t.roleId),
        p.index('idx_users_is_active').on(t.isActive),
        p.index('idx_users_active_role').on(t.isActive, t.roleId),
        p.index('idx_users_created_at').on(t.createdAt),
        p.index('idx_users_last_login').on(t.lastLoginAt),
    ],
)

export type UserRow = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
