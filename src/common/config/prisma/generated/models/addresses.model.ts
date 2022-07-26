import { IsInt, IsDefined, IsString, IsOptional, IsDate } from 'class-validator'
import { users } from '.'

export class addresses {
  @IsDefined()
  @IsInt()
  addressId!: number

  @IsDefined()
  @IsString()
  address!: string

  @IsOptional()
  @IsString()
  address2?: string

  @IsDefined()
  @IsInt()
  cityId!: number

  @IsOptional()
  @IsString()
  postalCode?: string

  @IsDefined()
  @IsString()
  phone!: string

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsDefined()
  users!: users[]
}
