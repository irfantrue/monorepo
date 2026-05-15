import { createRoleSchema } from '@domain/dtos/role.dto'
import { zValidator } from '@hono/zod-validator'
import { CreateRoleUseCase } from '@use-cases/rbac/role/create-role.use-case'
import { Hono } from 'hono'

interface Deps {
    createRole: CreateRoleUseCase
}

export function createRbacHandler(deps: Deps) {
    const app = new Hono()

    app.post('roles', zValidator('json', createRoleSchema), async c => {
        const dto = c.req.valid('json')
        const role = await deps.createRole.execute(dto)
        return c.json({ data: role }, 201)
    })

    return app
}
