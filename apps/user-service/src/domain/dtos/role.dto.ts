export interface CreateRoleRequest {
    name: string
    display: string
}

export interface RoleDto {
    id: string
    name: string
    display: string
    createdAt: string // ISO string
    updatedAt: string
}
