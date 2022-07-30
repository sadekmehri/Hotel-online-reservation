import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  private readonly logger: Logger = new Logger(PrismaService.name)

  constructor() {
    super({ log: ['query', 'info', 'warn', 'error'] })
  }

  async onModuleInit() {
    this.$on('query', ({ query, params, duration }) => {
      this.logger.log(
        `Query: ${query}`,
        `Params: ${params}`,
        `Duration: ${duration} ms`,
      )
    })

    this.$on('info', ({ message }) => {
      this.logger.log(`message: ${message}`)
    })

    this.$on('error', ({ message }) => {
      this.logger.log(`error: ${message}`)
    })

    this.$on('warn', ({ message }) => {
      this.logger.log(`warn: ${message}`)
    })

    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
