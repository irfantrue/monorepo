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
            .uuid('id')
            .primaryKey()
            .default(sql`uuidv7()`),
        name: p.varchar('name', { length: 100 }).notNull(),
        email: citext('email').notNull(),
        passwordHash: p.varchar('password_hash', { length: 255 }).notNull(),
        roleId: p.uuid('role_id').references((): AnyPgColumn => roles.id, { onDelete: 'set null' }),
        isActive: p.boolean('is_active').notNull().default(true),
        isVerified: p.boolean('is_verified').notNull().default(false),
        createdAt: p.timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: p.timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
        lastLoginAt: p.timestamp('last_login_at', { withTimezone: true }),
        emailVerifiedAt: p.timestamp('email_verified_at', { withTimezone: true }),
        passwordChangeAt: p.timestamp('password_changed_at', {
            withTimezone: true,
        }),
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
