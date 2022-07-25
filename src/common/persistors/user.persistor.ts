import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserFactory } from '../factory'
import { FactoryTypes, IPersist } from '../types'
import { UserModel } from '../models'
import { randomNumber } from '../utils/random.util'

const { IUserFactory } = FactoryTypes

@Injectable()
export class UserPersistor implements IPersist<Partial<UserModel>> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(IUserFactory)
    private readonly userFactory: UserFactory,
  ) {}

  /* Insert users data to database */
  async insert(limit: number = 10): Promise<UserModel[]> {
    const users: UserModel[] = <UserModel[]>(
      await this.userFactory.generate(limit)
    )

    await this.prismaService.users.createMany({
      data: users,
      skipDuplicates: true,
    })

    return users
  }

  /* Select random records from database */
  async select(limit: number = 10): Promise<Partial<UserModel>[]> {
    const usersCount: number = await this.prismaService.users.count()
    const skip: number = randomNumber(0, usersCount - 1)

    const users = await this.prismaService.users.findMany({
      take: limit,
      skip,
      select: {
        userId: true,
      },
    })

    return users
  }
}
