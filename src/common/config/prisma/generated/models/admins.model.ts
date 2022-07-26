import { IsInt, IsDefined, IsString, IsDate } from 'class-validator'
import '.'

export class admins {
  @IsDefined()
  @IsInt()
  adminId!: number

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
  password!: string

  @IsDefined()
  @IsDate()
  createDate!: Date

  @IsDefined()
  @IsDate()
  lastUpdate!: Date
}
