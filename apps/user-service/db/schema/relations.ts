import { defineRelationsPart } from 'drizzle-orm'

import { permissions } from './permissions'
import { rolePermissions } from './role_permissions'
import { roles } from './roles'
import { users } from './users'

const userRelations = defineRelationsPart({ users, roles }, r => ({
    users: {
        roles: r.one.roles({
            from: r.users.roleId,
            to: r.roles.id,
        }),
    },
}))

const roleRelations = defineRelationsPart({ users, roles, rolePermissions, permissions }, r => ({
    roles: {
        users: r.many.users({
            from: r.roles.id,
            to: r.users.roleId,
        }),
        rolePermissions: r.many.rolePermissions({
            from: r.roles.id,
            to: r.rolePermissions.roleId,
        }),
        permissions: r.many.permissions({
            from: r.roles.id.through(r.rolePermissions.roleId),
            to: r.permissions.id.through(r.rolePermissions.permissionId),
        }),
        roleInheritance: r.one.roles({
            from: r.roles.inherits,
            to: r.roles.id,
        }),
    },
}))

const permissionRelations = defineRelationsPart({ permissions, rolePermissions, roles }, r => ({
    permissions: {
        rolePermissions: r.many.rolePermissions({
            from: r.permissions.id,
            to: r.rolePermissions.permissionId,
        }),
        roles: r.many.roles({
            from: r.permissions.id.through(r.rolePermissions.permissionId),
            to: r.roles.id.through(r.rolePermissions.roleId),
        }),
    },
}))

const rolePermissionRelations = defineRelationsPart(
    { rolePermissions, roles, permissions, users },
    r => ({
        rolePermissions: {
            roles: r.one.roles({
                from: r.rolePermissions.roleId,
                to: r.roles.id,
            }),
            permissions: r.one.permissions({
                from: r.rolePermissions.permissionId,
                to: r.permissions.id,
            }),
            grantedByUser: r.one.users({
                from: r.rolePermissions.grantedBy,
                to: r.users.id,
                alias: 'grantedBy',
            }),
        },
    }),
)

export const relations = {
    ...userRelations,
    ...roleRelations,
    ...permissionRelations,
    ...rolePermissionRelations,
}
