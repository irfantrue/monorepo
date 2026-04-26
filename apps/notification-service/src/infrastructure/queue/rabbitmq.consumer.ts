import type { SendEmailUseCase } from '@use-cases/send-email.use-case'

import { env } from '@config/env'
import { logger } from '@shared/logger'
import amqplib, { type Channel } from 'amqplib'

import { SendEmailJobSchema } from '@/domain/dtos/send-email.dto'

const log = logger.child({ module: 'RabbitMQConsumer' })

export class RabbitMQConsumer {
    private connection: Awaited<ReturnType<typeof amqplib.connect>> | undefined
    private channel: Channel | undefined

    constructor(private readonly useCase: SendEmailUseCase) {}

    async connect(): Promise<void> {
        this.connection = await amqplib.connect(env.RABBITMQ_URL)
        this.channel = await this.connection.createChannel()

        // Durable queue - survive broker restart
        await this.channel.assertQueue(env.RABBITMQ_QUEUE, { durable: true })

        // Process one message at time
        this.channel.prefetch(1)

        log.info('RabbitMQ consumer ready', { queue: env.RABBITMQ_QUEUE })
    }

    async consume(): Promise<void> {
        const channel = this.channel
        if (!channel) throw new Error('Channel not initialized, call connect() first')

        channel.consume(env.RABBITMQ_QUEUE, async msg => {
            if (!msg) return

            let parsed: ReturnType<typeof SendEmailJobSchema.safeParse>

            try {
                const raw = JSON.parse(msg.content.toString())
                parsed = SendEmailJobSchema.safeParse(raw)

                if (!parsed.success) {
                    log.warn('invalid job payload - dead-lettering', {
                        errors: parsed.error.issues,
                    })

                    const allUpTo = false
                    const requeue = false
                    channel.nack(msg, allUpTo, requeue)
                    return
                }

                await this.useCase.execute(parsed.data)
                channel.ack(msg)
            } catch (err) {
                log.error('job failed - requeueing', { err })

                const allUpTo = false
                const requeue = true
                channel.nack(msg, allUpTo, requeue) // requeue once
            }
        })
    }

    async close(): Promise<void> {
        const channel = this.channel
        if (channel) await channel.close()
        const connection = this.connection
        if (connection) await connection.close()
        log.info('RabbitMQ connection closed')
    }
}
