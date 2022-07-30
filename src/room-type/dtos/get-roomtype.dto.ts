import { Expose } from 'class-transformer'

export class GetRoomTypeDto {
  @Expose({ name: 'id' })
  readonly roomTypeId: number

  name: string
}
