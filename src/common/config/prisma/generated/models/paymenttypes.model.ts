import { IsInt, IsDefined, IsString } from 'class-validator'
import { payments } from '.'

export class paymenttypes {
  @IsDefined()
  @IsInt()
  paymentTypeId!: number

  @IsDefined()
  @IsString()
  name!: string

  @IsDefined()
  payments!: payments[]
}
