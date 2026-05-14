export interface PermissionDto {
    id: string
    name: string
    resource: string
    action: string
    category?: string | null
}
