import { Permission } from './permission.entity'

export interface RolePermission {
    roleId: string
    permissionId: string
    isActive: boolean
    grantedBy: string | null
    grantedAt: Date
    notes: string | null
}

export interface RolePermissionWithPermissions extends RolePermission {
    permissions: Permission | null
}
