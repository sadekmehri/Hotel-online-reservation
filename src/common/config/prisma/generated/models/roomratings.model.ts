import { IsInt, IsDefined, IsString, IsDate } from 'class-validator'
import { rooms, users } from '.'

export class roomratings {
  @IsDefined()
  @IsInt()
  roomRatingId!: number

  @IsDefined()
  @IsInt()
  rating!: number

  @IsDefined()
  @IsString()
  description!: string

  @IsDefined()
  @IsInt()
  roomId!: number

  @IsDefined()
  @IsInt()
  userId!: number

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsDefined()
  rooms!: rooms

  @IsDefined()
  users!: users
}
