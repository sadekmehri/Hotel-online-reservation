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
        description: true,
      },
    })

    /* Check if there is no record */
    if (roomTypesRecords.length === 0)
      throw new HttpException(
        { message: `The are no room-types records!` },
        HttpStatus.NOT_FOUND,
      )

    return roomTypesRecords
  }
}
