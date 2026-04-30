import type { SendEmailJobDto } from '@/domain/dtos/send-email.dto'

export interface ISendEmailUseCase {
    execute(dto: SendEmailJobDto): Promise<void>
}
