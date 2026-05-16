import { CreateRoleUseCase } from '@application/use-cases/rbac/create-role.use-case'
import { FindAllRoleUseCase } from '@application/use-cases/rbac/find-all.use-case'
import { createRoleValidator, roleListValidator } from '@infrastructure/validators/role.validator'
import { validate } from '@presentation/middlewares/validate'
import { Hono } from 'hono'

interface Deps {
    createRole: CreateRoleUseCase
    findAllRole: FindAllRoleUseCase
}

export function createRbacHandler(deps: Deps) {
    const app = new Hono()

    app.post('roles', validate('json', createRoleValidator), async c => {
        const dto = c.req.valid('json')
        const role = await deps.createRole.execute(dto)
        return c.json({ data: role }, 201)
    })

    app.get('roles', validate('query', roleListValidator), async c => {
        const dto = c.req.valid('query')
        const role = await deps.findAllRole.execute(dto)
        return c.json({ data: role })
    })

    return app
}
