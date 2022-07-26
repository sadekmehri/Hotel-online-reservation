import { Inject, Injectable } from '@nestjs/common'
import { RoomFactory } from 'src/common/factory'
import { PrismaService } from 'src/prisma/prisma.service'
import { RoomModel } from '../models'
import { FactoryTypes, IPersist } from '../types'
import { randomNumber } from '../utils/random.util'

const { IRoomFactory } = FactoryTypes

@Injectable()
export class RoomPersistor implements IPersist<RoomModel> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(IRoomFactory)
    private readonly roomFactory: RoomFactory,
  ) {}

  /* Insert rooms data to database */
  async insert(limit: number = 10): Promise<void> {
    const rooms = await this.roomFactory.generate(limit)

    await this.prismaService.rooms.createMany({
      data: rooms,
      skipDuplicates: true,
    })
  }

  /* Select random records from database */
  async select(limit: number = 10): Promise<{ roomId: number }[]> {
    const roomsCount: number = await this.prismaService.rooms.count()
    const skip: number = randomNumber(0, roomsCount - 1)

    return await this.prismaService.rooms.findMany({
      take: limit,
      skip,
      select: {
        roomId: true,
      },
    })
  }
}
