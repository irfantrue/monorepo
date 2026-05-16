import { CreateRoleDto, FilterRoleDto } from '@application/dtos/role.dto'
import { Role, RoleWithPermissions } from '@domain/entities/role.entity'
import { Tx } from '@shared/types/database'

export interface IRoleRepository {
    create(data: CreateRoleDto, tx?: Tx): Promise<Role>
    findAll(filters?: FilterRoleDto, tx?: Tx): Promise<Role[]>
    findAllWithPermissions(filters?: FilterRoleDto, tx?: Tx): Promise<RoleWithPermissions[]>
    findById(id: string, tx?: Tx): Promise<Role | null>
    findByIdWithPermissions(id: string, tx?: Tx): Promise<RoleWithPermissions | null>
    findByName(name: string, tx?: Tx): Promise<Role | null>
}
