export interface RoomTypeModel {
  readonly roomTypeId: number
  description: string
}

export const RoomTypeModel = Symbol('RoomTypeModel')
