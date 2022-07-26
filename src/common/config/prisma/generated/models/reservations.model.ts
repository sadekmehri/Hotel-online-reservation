import { IsInt, IsDefined, IsDate } from 'class-validator'
import { users, bills, reservedrooms } from '.'

export class reservations {
  @IsDefined()
  @IsInt()
  reservationId!: number

  @IsDefined()
  @IsInt()
  userId!: number

  @IsDefined()
  @IsDate()
  dateIn!: Date

  @IsDefined()
  @IsDate()
  dateOut!: Date

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsDefined()
  users!: users

  @IsDefined()
  bills!: bills[]

  @IsDefined()
  reservedrooms!: reservedrooms[]
}
