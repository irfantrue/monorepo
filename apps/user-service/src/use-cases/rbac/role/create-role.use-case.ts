import { NewRole } from '@db/schema/roles'
import { Database } from '@infrastructure/db'
import { PostgresRoleRepository } from '@infrastructure/repositories/postgres-role.repository'
import { Effect } from 'effect'

export class CreateRoleUseCase {
    private readonly db: Database
    private readonly repo: PostgresRoleRepository

    constructor(db: Database, repo: PostgresRoleRepository) {
        this.db = db
        this.repo = repo
    }

    execute(data: NewRole) {
        return this.db.transaction(tx => {
            return Effect.gen(this, function* () {
                return yield* this.repo.create(tx, data)
            })
        })
    }
}
