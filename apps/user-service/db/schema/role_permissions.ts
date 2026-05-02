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
            .uuid()
            .notNull()
            .references((): AnyPgColumn => roles.id, { onDelete: 'cascade' }),
        permissionId: p
            .uuid()
            .notNull()
            .references((): AnyPgColumn => permissions.id, { onDelete: 'cascade' }),
        grantedBy: p.uuid().references((): AnyPgColumn => users.id, { onDelete: 'set null' }),
        grantedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
        isActive: p.boolean().notNull().default(true),
        notes: p.varchar({ length: 500 }),
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
