import { IsInt, IsDefined, IsString, IsBoolean, IsDate } from 'class-validator'
import { roomtypes, reservedrooms, roomratings } from '.'

export class rooms {
  @IsDefined()
  @IsInt()
  roomId!: number

  @IsDefined()
  @IsString()
  code!: string

  @IsDefined()
  @IsBoolean()
  status!: boolean

  @IsDefined()
  @IsBoolean()
  reserved!: boolean

  @IsDefined()
  @IsInt()
  price!: number

  @IsDefined()
  @IsInt()
  roomTypeId!: number

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsDefined()
  roomtypes!: roomtypes

  @IsDefined()
  reservedrooms!: reservedrooms[]

  @IsDefined()
  roomratings!: roomratings[]
}
