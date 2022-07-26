import { IsInt, IsDefined, IsString } from 'class-validator'
import '.'

export class countries {
  @IsDefined()
  @IsInt()
  countryId!: number

  @IsDefined()
  @IsString()
  name!: string
}
