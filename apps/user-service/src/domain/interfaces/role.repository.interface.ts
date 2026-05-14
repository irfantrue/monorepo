import { NewRole } from '@db/schema/roles'
import { Role, RoleWithPermissions } from '@domain/entities/role.entity'
import { Tx } from '@shared/types/database'
import { PaginationParams } from '@shared/types/pagination'

export interface RoleFilters extends PaginationParams {
    hasPermission?: string
}

export interface IRoleRepository {
    create(data: NewRole, tx?: Tx): Promise<Role>
    findAll(filters?: RoleFilters, tx?: Tx): Promise<Role[]>
    findAllWithPermissions(filters?: RoleFilters, tx?: Tx): Promise<RoleWithPermissions[]>
    findById(id: string, tx?: Tx): Promise<Role | null>
    findByIdWithPermissions(id: string, tx?: Tx): Promise<RoleWithPermissions | null>
    findByName(name: string, tx?: Tx): Promise<Role | null>
}
