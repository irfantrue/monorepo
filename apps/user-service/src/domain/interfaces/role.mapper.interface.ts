import { RoleRow } from '@db/schema/roles'
import { Role, RoleWithPermissions } from '@domain/entities/role.entity'
import { RoleWithPermissionRow } from '@domain/mappers/role.mapper'

export interface IRoleMapper {
    toDomain(row: RoleRow): Role
    toDomainWithPermissions(row: RoleWithPermissionRow): RoleWithPermissions
}
