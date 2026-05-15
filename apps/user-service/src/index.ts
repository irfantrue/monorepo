import { CreateRoleUseCase } from '@application/use-cases/rbac/create-role.use-case'
import { env } from '@config/env'
import { ValidationError } from '@domain/errors/validation.error'
import { db, TransactionManager } from '@infrastructure/db'
import { RoleMapper } from '@infrastructure/mappers/role.mapper'
import { PostgresRoleRepository } from '@infrastructure/repositories/postgres-role.repository'
import { createRbacHandler } from '@presentation/handlers/rbac.handler'
import { logger } from '@shared/logger'
import { Hono } from 'hono/tiny'
import { ContentfulStatusCode } from 'hono/utils/http-status'

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
        if (err instanceof ValidationError) {
            return c.json(
                { error: 'Validation Error', details: err.context.issues },
                err.statusCode as ContentfulStatusCode,
            )
        }

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
