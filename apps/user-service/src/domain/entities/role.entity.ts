import { RolePermissionWithPermissions } from './role-permission.entity'

export interface Role {
    id: string
    name: string
    display: string
    inherits?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface RoleWithPermissions extends Role {
    rolePermissions: RolePermissionWithPermissions[]
}
