import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { GetRoomTypeDto } from '../dtos'

@Injectable()
export class RoomTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  /* Get list of room types records */
  async getRoomTypes(): Promise<GetRoomTypeDto[]> {
    const roomTypesRecords = await this.prismaService.roomtypes.findMany({
      select: {
        roomTypeId: true,
        name: true,
      },
      orderBy: {
        roomTypeId: 'desc',
      },
    })

    // Check if there is no record
    if (roomTypesRecords.length === 0)
      throw new HttpException(
        { message: `The are no room-types records!` },
        HttpStatus.NOT_FOUND,
      )

    return roomTypesRecords
  }

  /* Get room type by id */
  async getRoomTypeById(roomTypeId: number): Promise<GetRoomTypeDto> {
    // Check if room type exists by giving its id
    const roomType = await this.prismaService.roomtypes.findUnique({
      where: {
        roomTypeId,
      },
      select: {
        roomTypeId: true,
        name: true,
      },
    })

    if (!roomType)
      throw new HttpException(
        {
          message: `There is no room type record with this given id: ${roomTypeId}!`,
        },
        HttpStatus.NOT_FOUND,
      )

    return roomType
  }
}
