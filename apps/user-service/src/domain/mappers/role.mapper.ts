import { db } from '@infrastructure/db'

export type RoleWithPermissionRow = Awaited<
    ReturnType<
        typeof db.query.roles.findMany<{
            with: {
                rolePermissions: {
                    with: {
                        permissions: true
                    }
                }
            }
        }>
    >
>[number]
