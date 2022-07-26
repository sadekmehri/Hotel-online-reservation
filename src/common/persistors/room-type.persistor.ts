import { Inject, Injectable } from '@nestjs/common'
import { RoomTypeFactory } from 'src/common/factory'
import { PrismaService } from 'src/prisma/prisma.service'
import { RoomTypeModel } from '../models'
import { FactoryTypes, IPersist } from '../types'
import { randomNumber } from '../utils/random.util'

const { IRoomTypeFactory } = FactoryTypes

@Injectable()
export class RoomTypePersistor implements IPersist<RoomTypeModel> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(IRoomTypeFactory)
    private readonly roomTypeFactory: RoomTypeFactory,
  ) {}

  /* Insert room-type data to database */
  async insert(limit: number = 10): Promise<void> {
    const roomTypes = await this.roomTypeFactory.generate(limit)

    await this.prismaService.roomtypes.createMany({
      data: roomTypes,
      skipDuplicates: true,
    })
  }

  /* Select random records from database */
  async select(limit: number = 10): Promise<{ roomTypeId: number }[]> {
    const roomTypesCount: number = await this.prismaService.roomtypes.count()
    const skip: number = randomNumber(0, roomTypesCount - 1)

    return await this.prismaService.roomtypes.findMany({
      take: limit,
      skip,
      select: {
        roomTypeId: true,
      },
    })
  }
}
