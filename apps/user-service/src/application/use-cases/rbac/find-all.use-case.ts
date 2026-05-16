import { IRoleRepository } from '@domain/interfaces/role.repository.interface'
import { ITransactionManager } from '@domain/interfaces/transaction-manager.interface'
import { FilterRoleDto } from '@shared/contracts/role.contract'

export class FindAllRoleUseCase {
    private readonly txm: ITransactionManager
    private readonly repo: IRoleRepository

    constructor(txm: ITransactionManager, repo: IRoleRepository) {
        this.txm = txm
        this.repo = repo
    }

    async execute(filters: FilterRoleDto) {}
}
