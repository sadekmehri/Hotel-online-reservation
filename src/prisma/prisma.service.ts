import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    // query, info
    super({ log: ['warn', 'error'] })
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

  async truncate() {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_')
    const prismaModels = models.filter((modelKey) => modelKey !== 'logger')
    return Promise.all(
      prismaModels.map((modelKey) => this[modelKey].deleteMany()),
    )
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
