import { faker } from '@faker-js/faker'
import { RoomModel } from '../models'
import { randomNumber } from '../utils/random.util'

/* Generate random room records */
export const generateRooms = async (
  limit: number = 10,
  roomTypeCount: number,
): Promise<RoomModel[]> => {
  const rooms: RoomModel[] = []

  for (let i = 0; i < limit; i++) {
    const randomRoomType = randomNumber(0, roomTypeCount)
    const room = await create(randomRoomType)
    rooms.push(room)
  }

  return rooms
}

/* Create single room record */
const create = async (roomTypeId: number): Promise<RoomModel> => {
  return {
    code: `Room-${faker.random.alpha(10)}`,
    price: +faker.random.numeric(3, { bannedDigits: ['0'] }) * 100,
    roomTypeId,
  }
}
