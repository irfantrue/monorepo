import { rolePermissions } from '@db/schema/role_permissions'
import { RoleRow } from '@db/schema/roles'
import { Role, RoleWithPermissions } from '@domain/dtos/role.dto'
import { IRoleMapper } from '@domain/interfaces/role.mapper.interface'
import { RoleWithPermissionRow } from '@domain/mappers/role.mapper'

export class RoleMapper implements IRoleMapper {
    toDomain(row: RoleRow): Role {
        return {
            id: row.id,
            name: row.name,
            display: row.display,
            inherits: row.inherits,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        }
    }

    toDomainWithPermissions(row: RoleWithPermissionRow): RoleWithPermissions {
        return {
            id: row.id,
            name: row.name,
            display: row.display,
            inherits: row.inherits,
            rolePermissions: row.rolePermissions.map(rp => {
                return {
                    roleId: rp.roleId,
                    permissionId: rp.permissionId,
                    isActive: rp.isActive,
                    grantedBy: rp.grantedBy,
                    grantedAt: rp.grantedAt,
                    notes: rp.notes,
                    permissions: rp.permissions
                        ? {
                              id: rp.permissions.id,
                              name: rp.permissions.name,
                              resource: rp.permissions.resource,
                              action: rp.permissions.action,
                              description: rp.permissions.description,
                              category: rp.permissions.category,
                              isActive: rp.permissions.isActive,
                              createdAt: rp.permissions.createdAt,
                              updatedAt: rp.permissions.updatedAt,
                          }
                        : null,
                }
            }),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        }
    }
}
