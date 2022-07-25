import { Inject, Injectable } from '@nestjs/common'
import { RoomTypeFactory } from 'src/common/factory'
import { PrismaService } from 'src/prisma/prisma.service'
import { FactoryTypes, IPersist } from '../types'
import { RoomTypeModel } from '../models'
import { randomNumber } from '../utils/random.util'

const { IRoomTypeFactory } = FactoryTypes
@Injectable()
export class RoomTypePersistor implements IPersist<Partial<RoomTypeModel>> {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(IRoomTypeFactory) private readonly roomTypeFactory: RoomTypeFactory,
  ) {}

  /* Insert users data to database */
  async insert(limit: number = 10): Promise<RoomTypeModel[]> {
    const roomTypes: RoomTypeModel[] = <RoomTypeModel[]>(
      await this.roomTypeFactory.generate(limit)
    )

    await this.prismaService.roomtypes.createMany({
      data: roomTypes,
      skipDuplicates: true,
    })

    return roomTypes
  }

  /* Select random records from database */
  async select(limit: number = 10): Promise<Partial<RoomTypeModel>[]> {
    const roomTypesCount: number = await this.prismaService.roomtypes.count()
    const skip: number = randomNumber(0, roomTypesCount - 1)

    const roomTypes = await this.prismaService.roomtypes.findMany({
      take: limit,
      skip,
      select: {
        roomTypeId: true,
      },
    })

    return roomTypes
  }
}
