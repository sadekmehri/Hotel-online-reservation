import { faker } from '@faker-js/faker'
import { RoomTypeModel } from '../models'

/* Generate room type */
export const generateRoomTypes = async (
  limit: number = 10,
): Promise<RoomTypeModel[]> => {
  const roomTypes: RoomTypeModel[] = []

  for (let i = 0; i < limit; i++) {
    const roomType = await create()
    roomTypes.push(roomType)
  }

  return roomTypes
}

/* Create single room-type record */
const create = async (): Promise<RoomTypeModel> => {
  return {
    name: faker.random.alpha(10),
  }
}
