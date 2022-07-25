export interface RoomModel {
  roomId: number
  code: string
  status: boolean
  reserved: boolean
  price: number
  roomTypeId: number
}

export const RoomModel = Symbol('RoomModel')
