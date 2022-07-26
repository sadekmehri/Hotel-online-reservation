import { Expose } from 'class-transformer'

export class GetRoomTypeDto {
  @Expose({ name: 'id' })
  readonly roomTypeId: number

  description: string
}
