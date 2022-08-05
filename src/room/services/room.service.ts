import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Paginator } from 'src/common/constants'
import { IPaginateResponse, PaginateRequest } from 'src/common/types'
import { paginate } from 'src/common/utils/paginate.util'
import { PrismaService } from 'src/prisma/prisma.service'
import { RoomTypeService } from 'src/room-type/services/room-type.service'
import { CreateRoomDto, GetRoomDto } from '../dtos'

@Injectable()
export class RoomService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomTypeService: RoomTypeService,
  ) {}

  /* Get list of rooms */
  async getRooms(
    props: PaginateRequest,
  ): Promise<IPaginateResponse<GetRoomDto>> {
    let { page = 1, limit = Paginator.LIMIT_PER_PAGE } = props

    // Check if limit is above the defined constant
    limit = limit > Paginator.LIMIT_PER_PAGE ? Paginator.LIMIT_PER_PAGE : limit

    // Get number of room records by applying these filters
    const roomsCount = await this.prismaService.rooms.count()

    // Check if there is any records
    if (roomsCount === 0)
      throw new HttpException(
        { message: `There is no record!` },
        HttpStatus.NOT_FOUND,
      )

    // Get number of pages and check if the given page is in the range
    const pageCount = Math.ceil(roomsCount / limit)

    if (page <= 0 || page > pageCount)
      throw new HttpException(
        { message: `There is no record!` },
        HttpStatus.NOT_FOUND,
      )

    // Get list of room by applying the filters
    const rooms = await this.prismaService.rooms.findMany({
      select: {
        roomId: true,
        code: true,
        price: true,
        reserved: true,
        status: true,
        roomtypes: true,
      },
      skip: limit * (page - 1),
      take: limit,
      orderBy: {
        roomId: 'desc',
      },
    })

    // Return data as custom response shape
    const response = paginate<GetRoomDto>(rooms, page, limit, pageCount)

    return response
  }

  /* Get room by id */
  async getRoomById(roomId: number): Promise<GetRoomDto> {
    // Check if the room exists by id
    const room = await this.prismaService.rooms.findUnique({
      where: { roomId },
      select: {
        roomId: true,
        code: true,
        price: true,
        reserved: true,
        status: true,
        roomtypes: true,
      },
    })

    if (!room)
      throw new HttpException(
        { message: `There is no room with this id: ${roomId}!` },
        HttpStatus.NOT_FOUND,
      )

    return room
  }

  /* Get room by code */
  async getRoomByCode(code: string): Promise<GetRoomDto> {
    // Check if the room exists by code
    const room = await this.prismaService.rooms.findUnique({
      where: { code },
      select: {
        roomId: true,
        code: true,
        price: true,
        reserved: true,
        status: true,
        roomtypes: true,
      },
    })

    if (!room)
      throw new HttpException(
        { message: `There is no room with this code: ${code}!` },
        HttpStatus.NOT_FOUND,
      )

    return room
  }

  /* Create new room */
  async createRoom(createRoomDto: CreateRoomDto): Promise<GetRoomDto> {
    const { code, roomTypeId } = createRoomDto

    // Check if the room type exist by passing the id as param
    await this.roomTypeService.getRoomTypeById(roomTypeId)

    // Check if the room code exists
    const roomCode = `Room-${code}`

    const isRoomExistByCode = await this.prismaService.rooms.findUnique({
      where: {
        code: roomCode,
      },
      select: {
        code: true,
      },
    })

    if (isRoomExistByCode)
      throw new HttpException(
        { message: `The room code number was already taken!` },
        HttpStatus.BAD_REQUEST,
      )

    // Save new room to database
    const newRoom = await this.prismaService.rooms.create({
      data: { ...createRoomDto, code: roomCode },
      select: {
        roomId: true,
        code: true,
        price: true,
        reserved: true,
        status: true,
        roomtypes: true,
      },
    })

    return newRoom
  }
}
