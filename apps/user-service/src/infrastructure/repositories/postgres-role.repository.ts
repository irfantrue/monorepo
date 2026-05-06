import { NewRole, roles } from '@db/schema/roles'
import { Role, RoleWithPermissions } from '@domain/dtos/role.dto'
import { IRoleMapper } from '@domain/interfaces/role.mapper.interface'
import { IRoleRepository, RoleFilters } from '@domain/interfaces/role.repository.interface'
import { DatabaseError } from '@shared/errors/database.error'
import { Tx } from '@shared/types/database'
import { RepositoryEffect } from '@shared/types/repository-effect'
import { eq } from 'drizzle-orm'
import { Effect } from 'effect'

export class PostgresRoleRepository implements IRoleRepository {
    constructor(private readonly mapper: IRoleMapper) {}

    create(tx: Tx, data: NewRole): RepositoryEffect<Role> {
        return Effect.gen(this, function* () {
            const rows = yield* Effect.tryPromise({
                try: () => tx.insert(roles).values(data).returning(),
                catch: error => {
                    return new DatabaseError({ cause: error instanceof Error ? error : undefined })
                },
            })

            if (rows.length === 0) {
                throw new DatabaseError({ cause: new Error('Insert failed, no rows returned') })
            }

            return this.mapper.toDomain(rows[0]!)
        })
    }

    findAll(tx: Tx, filters?: RoleFilters): RepositoryEffect<Role[]> {
        return Effect.gen(this, function* () {
            return yield* Effect.tryPromise({
                try: () => {
                    return tx
                        .select()
                        .from(roles)
                        .orderBy(roles.createdAt)
                        .limit(filters?.limit ?? 10)
                        .offset(filters?.offset ?? 0)
                },
                catch: error => {
                    return new DatabaseError({ cause: error instanceof Error ? error : undefined })
                },
            }).pipe(Effect.map(rows => rows.map(this.mapper.toDomain)))
        })
    }

    findAllWithPermissions(tx: Tx, filters?: RoleFilters): RepositoryEffect<RoleWithPermissions[]> {
        return Effect.gen(this, function* () {
            return yield* Effect.tryPromise({
                try: () => {
                    return tx.query.roles.findMany({
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
                },
                catch: error => {
                    return new DatabaseError({ cause: error instanceof Error ? error : undefined })
                },
            }).pipe(Effect.map(rows => rows.map(this.mapper.toDomainWithPermissions)))
        })
    }

    findById(tx: Tx, id: string): RepositoryEffect<Role | null> {
        return Effect.gen(this, function* () {
            return yield* Effect.tryPromise({
                try: () => {
                    return tx.select().from(roles).where(eq(roles.id, id)).limit(1)
                },
                catch: error => {
                    return new DatabaseError({ cause: error instanceof Error ? error : undefined })
                },
            }).pipe(Effect.map(rows => (rows[0] ? this.mapper.toDomain(rows[0]) : null)))
        })
    }

    findByIdWithPermissions(tx: Tx, id: string): RepositoryEffect<RoleWithPermissions | null> {
        return Effect.gen(this, function* () {
            return yield* Effect.tryPromise({
                try: () => {
                    return tx.query.roles.findFirst({
                        with: {
                            rolePermissions: {
                                with: {
                                    permissions: true,
                                },
                            },
                        },
                        where: { id },
                    })
                },
                catch: error => {
                    return new DatabaseError({ cause: error instanceof Error ? error : undefined })
                },
            }).pipe(Effect.map(rows => (rows ? this.mapper.toDomainWithPermissions(rows) : null)))
        })
    }
}
