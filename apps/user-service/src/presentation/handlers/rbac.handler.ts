import { CreateRoleUseCase } from '@application/use-cases/rbac/create-role.use-case'
import { validate } from '@presentation/middlewares/validate'
import { createRoleSchema } from '@shared/contracts/role.contract'
import { Hono } from 'hono'

interface Deps {
    createRole: CreateRoleUseCase
}

export function createRbacHandler(deps: Deps) {
    const app = new Hono()

    app.post('roles', validate(createRoleSchema), async c => {
        const dto = c.req.valid('json')
        const role = await deps.createRole.execute(dto)
        return c.json({ data: role }, 201)
    })

    return app
}
