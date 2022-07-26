import { IsInt, IsDefined, IsString } from 'class-validator'
import { rooms } from '.'

export class roomtypes {
  @IsDefined()
  @IsInt()
  roomTypeId!: number

  @IsDefined()
  @IsString()
  description!: string

  @IsDefined()
  rooms!: rooms[]
}
