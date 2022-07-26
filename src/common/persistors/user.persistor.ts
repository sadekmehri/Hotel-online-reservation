import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserFactory } from '../factory'
import { UserModel } from '../models'
import { FactoryTypes, IPersist } from '../types'
import { randomNumber } from '../utils/random.util'

const { IUserFactory } = FactoryTypes

@Injectable()
export class UserPersistor implements IPersist<UserModel> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(IUserFactory)
    private readonly userFactory: UserFactory,
  ) {}

  /* Insert users data to database */
  async insert(limit: number = 10): Promise<void> {
    const users = await this.userFactory.generate(limit)

    await this.prismaService.users.createMany({
      data: users,
      skipDuplicates: true,
    })
  }

  /* Select random records from database */
  async select(limit: number = 10): Promise<{ userId: number }[]> {
    const usersCount: number = await this.prismaService.users.count()
    const skip: number = randomNumber(0, usersCount - 1)

    return await this.prismaService.users.findMany({
      take: limit,
      skip,
      select: {
        userId: true,
      },
    })
  }
}
