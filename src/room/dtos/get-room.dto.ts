import { GetRoomTypeDto } from 'src/room-type/dtos'

export class GetRoomDto {
  readonly roomId: number

  code: string

  status: boolean

  reserved: boolean

  price: number

  readonly roomtypes: GetRoomTypeDto
}
