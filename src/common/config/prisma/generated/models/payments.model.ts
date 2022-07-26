import {
  IsInt,
  IsDefined,
  IsBoolean,
  IsString,
  IsOptional,
  IsDate,
} from 'class-validator'
import { bills, paymenttypes } from '.'

export class payments {
  @IsDefined()
  @IsInt()
  paymentId!: number

  @IsDefined()
  @IsInt()
  billId!: number

  @IsDefined()
  @IsInt()
  paymentTypeId!: number

  @IsDefined()
  @IsBoolean()
  status!: boolean

  @IsOptional()
  @IsString()
  transactionId?: string

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsDefined()
  bills!: bills

  @IsDefined()
  paymenttypes!: paymenttypes
}
