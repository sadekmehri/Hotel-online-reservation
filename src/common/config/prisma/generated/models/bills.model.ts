import { IsInt, IsDefined, IsDate } from 'class-validator'
import { reservations, payments } from '.'

export class bills {
  @IsDefined()
  @IsInt()
  billId!: number

  @IsDefined()
  @IsInt()
  reservationId!: number

  @IsDefined()
  @IsInt()
  total!: number

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsDefined()
  reservations!: reservations

  @IsDefined()
  payments!: payments[]
}
