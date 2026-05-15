import { env } from '@config/env'
import { db, TransactionManager } from '@infrastructure/db'
import { RoleMapper } from '@infrastructure/mappers/role.mapper'
import { PostgresRoleRepository } from '@infrastructure/repositories/postgres-role.repository'
import { logger } from '@shared/logger'
import { CreateRoleUseCase } from '@use-cases/rbac/role/create-role.use-case'
import { Hono } from 'hono/tiny'

import { createRbacHandler } from './presentation/rbac.handler'

const log = logger.child({ module: 'App' })

async function bootstrap() {
    const roleMapper = new RoleMapper()

    const roleRepo = new PostgresRoleRepository(db, roleMapper)

    const transactionManager = new TransactionManager(db)

    const createRole = new CreateRoleUseCase(transactionManager, roleRepo)

    const app = new Hono()

    app.route('/rbac', createRbacHandler({ createRole }))

    app.get('/health', c => c.json({ status: 'ok', service: 'user-service' }))
    app.notFound(c => c.json({ error: 'Not Found' }, 404))
    app.onError((err, c) => {
        log.error('unhandled error', { err })
        return c.json({ error: 'Internal Server Error' }, 500)
    })

    const shutdown = async (signal: string) => {
        log.info('shutting down...', { signal })
        process.exit(0)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    log.info(`User service running on http://localhost:${env.PORT}`)

    return { port: env.PORT, fetch: app.fetch }
}

export default await bootstrap()
