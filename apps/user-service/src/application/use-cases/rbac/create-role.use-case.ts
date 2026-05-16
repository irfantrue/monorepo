import { RoleAlreadyExistError } from '@domain/errors/role-already-exists.error'
import { IRoleRepository } from '@domain/interfaces/role.repository.interface'
import { ITransactionManager } from '@domain/interfaces/transaction-manager.interface'
import { CreateRoleDto } from '@shared/contracts/role.contract'

export class CreateRoleUseCase {
    private readonly txm: ITransactionManager
    private readonly repo: IRoleRepository

    constructor(txm: ITransactionManager, repo: IRoleRepository) {
        this.txm = txm
        this.repo = repo
    }

    async execute(req: CreateRoleDto) {
        return this.txm.transaction(async tx => {
            const existing = await this.repo.findByName(req.name, tx)

            if (existing) {
                throw new RoleAlreadyExistError({ context: { name: req.name } })
            }

            return this.repo.create(req, tx)
        })
    }
}
