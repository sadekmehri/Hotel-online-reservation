import { Transform } from 'class-transformer'
import { parseDateToString } from 'src/common/utils/date.util'

export class GetUserDto {
  readonly userId: number

  firstName: string

  lastName: string

  email: string

  @Transform(({ value }) => parseDateToString(value))
  dob: Date
}
