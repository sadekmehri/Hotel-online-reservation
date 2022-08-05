import { Transform } from 'class-transformer'
import { GetRoomTypeDto } from 'src/room-type/dtos'

export class GetRoomDto {
  readonly roomId: number

  code: string

  status: boolean

  reserved: boolean

  @Transform(({ value }) => value / 100)
  price: number

  readonly roomtypes: GetRoomTypeDto
}
