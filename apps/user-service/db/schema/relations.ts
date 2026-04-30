import { relations } from 'drizzle-orm'

import { permissions } from './permissions'
import { rolePermissions } from './role_permissions'
import { roles } from './roles'
import { users } from './users'

export const usersRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
}))

export const rolesRelations = relations(roles, ({ one, many }) => ({
    users: many(users),
    rolePermissions: many(rolePermissions),
    inheritsTo: one(roles, {
        fields: [roles.inherits],
        references: [roles.id],
        relationName: 'roleInheritance',
    }),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
    rolePermissions: many(rolePermissions),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id],
    }),
    grantedByUser: one(users, {
        fields: [rolePermissions.grantedBy],
        references: [users.id],
        relationName: 'grantedBy',
    }),
}))
