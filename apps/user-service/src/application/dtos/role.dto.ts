import { PaginationDto } from './pagination.dto'

export interface CreateRoleDto {
    name: string
    display: string
    inherits?: string | null | undefined
}

export interface FilterRoleDto extends PaginationDto {
    hasPermissions: boolean
}
