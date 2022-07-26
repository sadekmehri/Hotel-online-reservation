import { IsInt, IsDefined, IsBoolean } from 'class-validator'
import { reservations, rooms } from '.'

export class reservedrooms {
  @IsDefined()
  @IsInt()
  reservedRoomId!: number

  @IsDefined()
  @IsInt()
  reservationId!: number

  @IsDefined()
  @IsInt()
  roomId!: number

  @IsDefined()
  @IsInt()
  price!: number

  @IsDefined()
  @IsBoolean()
  status!: boolean

  @IsDefined()
  reservations!: reservations

  @IsDefined()
  rooms!: rooms
}
