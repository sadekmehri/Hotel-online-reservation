import { IsInt, IsDefined, IsString } from 'class-validator'
import '.'

export class cities {
  @IsDefined()
  @IsInt()
  cityId!: number

  @IsDefined()
  @IsString()
  city!: string

  @IsDefined()
  @IsInt()
  countryId!: number
}
