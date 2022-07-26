import {
  IsInt,
  IsDefined,
  IsString,
  IsDate,
  IsOptional,
  IsBoolean,
} from 'class-validator'
import { addresses, reservations, roomratings } from '.'

export class users {
  @IsDefined()
  @IsInt()
  userId!: number

  @IsDefined()
  @IsString()
  firstName!: string

  @IsDefined()
  @IsString()
  lastName!: string

  @IsDefined()
  @IsString()
  email!: string

  @IsDefined()
  @IsString()
  cin!: string

  @IsDefined()
  @IsDate()
  dob!: Date

  @IsDefined()
  @IsString()
  password!: string

  @IsOptional()
  @IsString()
  refreshToken?: string

  @IsDefined()
  @IsBoolean()
  isEmailConfirmed!: boolean

  @IsDefined()
  @IsBoolean()
  isActive!: boolean

  @IsOptional()
  @IsInt()
  addressId?: number

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date

  @IsOptional()
  addresses?: addresses

  @IsDefined()
  reservations!: reservations[]

  @IsDefined()
  roomratings!: roomratings[]
}
