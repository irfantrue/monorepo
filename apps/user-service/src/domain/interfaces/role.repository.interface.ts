import { NewRole } from '@db/schema/roles'
import { Role, RoleWithPermissions } from '@domain/dtos/role.dto'
import { Tx } from '@shared/types/database'
import { PaginationParams } from '@shared/types/pagination'
import { RepositoryEffect } from '@shared/types/repository-effect'

export interface RoleFilters extends PaginationParams {
    hasPermission?: string
}

export interface IRoleRepository {
    create(tx: Tx, data: NewRole): RepositoryEffect<Role>
    findAll(tx: Tx, filters?: RoleFilters): RepositoryEffect<Role[]>
    findAllWithPermissions(tx: Tx, filters?: RoleFilters): RepositoryEffect<RoleWithPermissions[]>
    findById(tx: Tx, id: string): RepositoryEffect<Role | null>
    findByIdWithPermissions(tx: Tx, id: string): RepositoryEffect<RoleWithPermissions | null>
}
