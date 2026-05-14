import { NewRole, roles } from '@db/schema/roles'
import { Role, RoleWithPermissions } from '@domain/entities/role.entity'
import { IRoleMapper } from '@domain/interfaces/role.mapper.interface'
import { IRoleRepository, RoleFilters } from '@domain/interfaces/role.repository.interface'
import { DatabaseError } from '@shared/errors/database.error'
import { Database, Tx } from '@shared/types/database'
import { eq } from 'drizzle-orm'

export class PostgresRoleRepository implements IRoleRepository {
    private readonly db: Database
    private readonly mapper: IRoleMapper

    constructor(db: Database, mapper: IRoleMapper) {
        this.db = db
        this.mapper = mapper
    }

    async create(data: NewRole, tx?: Tx): Promise<Role> {
        try {
            const client = tx ?? this.db

            const rows = await client.insert(roles).values(data).returning()

            if (rows.length === 0) {
                throw new DatabaseError({ cause: new Error('Insert failed, no rows returned') })
            }

            return this.mapper.toDomain(rows[0]!)
        } catch (e) {
            throw new DatabaseError({ cause: e instanceof Error ? e : undefined })
        }
    }

    async findAll(filters?: RoleFilters, tx?: Tx): Promise<Role[]> {
        try {
            const client = tx ?? this.db

            const rows = await client
                .select()
                .from(roles)
                .orderBy(roles.createdAt)
                .limit(filters?.limit ?? 10)
                .offset(filters?.offset ?? 0)

            return rows.map(this.mapper.toDomain)
        } catch (e) {
            throw new DatabaseError({ cause: e instanceof Error ? e : undefined })
        }
    }

    async findAllWithPermissions(filters?: RoleFilters, tx?: Tx): Promise<RoleWithPermissions[]> {
        try {
            const client = tx ?? this.db

            const rows = await client.query.roles.findMany({
                with: {
                    rolePermissions: {
                        with: {
                            permissions: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                limit: filters?.limit ?? 10,
                offset: filters?.offset ?? 0,
            })

            return rows.map(this.mapper.toDomainWithPermissions)
        } catch (e) {
            throw new DatabaseError({ cause: e instanceof Error ? e : undefined })
        }
    }

    async findById(id: string, tx?: Tx): Promise<Role | null> {
        try {
            const client = tx ?? this.db

            const rows = await client.select().from(roles).where(eq(roles.id, id)).limit(1)

            return rows[0] ? this.mapper.toDomain(rows[0]) : null
        } catch (e) {
            throw new DatabaseError({ cause: e instanceof Error ? e : undefined })
        }
    }

    async findByIdWithPermissions(id: string, tx?: Tx): Promise<RoleWithPermissions | null> {
        try {
            const client = tx ?? this.db

            const rows = await client.query.roles.findFirst({
                with: {
                    rolePermissions: {
                        with: {
                            permissions: true,
                        },
                    },
                },
                where: { id },
            })

            return rows ? this.mapper.toDomainWithPermissions(rows) : null
        } catch (e) {
            throw new DatabaseError({ cause: e instanceof Error ? e : undefined })
        }
    }

    async findByName(name: string, tx?: Tx): Promise<Role | null> {
        try {
            const client = tx ?? this.db

            const rows = await client.select().from(roles).where(eq(roles.name, name)).limit(1)

            return rows[0] ? this.mapper.toDomain(rows[0]) : null
        } catch (e) {
            throw new DatabaseError({ cause: e instanceof Error ? e : undefined })
        }
    }
}
