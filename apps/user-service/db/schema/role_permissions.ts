import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import { sql } from 'drizzle-orm'
import * as p from 'drizzle-orm/pg-core'

import { permissions } from './permissions'
import { roles } from './roles'
import { authSchema } from './schema'
import { users } from './users'

export const rolePermissions = authSchema.table(
    'role_permissions',
    {
        roleId: p
            .uuid('role_id')
            .notNull()
            .references((): AnyPgColumn => roles.id, { onDelete: 'cascade' }),
        permissionId: p
            .uuid('permission_id')
            .notNull()
            .references((): AnyPgColumn => permissions.id, { onDelete: 'cascade' }),
        grantedBy: p
            .uuid('granted_by')
            .notNull()
            .references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
        grantedAt: p.timestamp('granted_at', { withTimezone: true }).notNull().defaultNow(),
        isActive: p.boolean('is_active').notNull().default(true),
        notes: p.varchar('notes', { length: 500 }),
    },
    t => [
        p.primaryKey({ columns: [t.roleId, t.permissionId] }),
        p.index('idx_role_permissions_granted_by').on(t.grantedBy),
        p
            .index('idx_role_permissions_active')
            .on(t.roleId, t.permissionId)
            .where(sql`${t.isActive} = true`),
    ],
)

export type RolePermissionRow = typeof rolePermissions.$inferSelect
export type NewRolePermission = typeof rolePermissions.$inferInsert
