import { faker } from '@faker-js/faker'
import { Inject, Injectable } from '@nestjs/common'
import { RoomModel } from '../models'
import { RoomTypePersistor } from '../persistors'
import { PersistorTypes } from '../types'
import { IFactory } from '../types/IFactory.type'
import { randomNumber } from '../utils/random.util'

const { IRoomTypePersistor } = PersistorTypes

@Injectable()
export class RoomFactory implements IFactory<RoomModel> {
  constructor(
    @Inject(IRoomTypePersistor)
    private readonly roomTypePersistor: RoomTypePersistor,
  ) {}

  /* Generate random room records */
  async generate(limit: number = 10): Promise<RoomModel[]> {
    const rooms: RoomModel[] = []
    let room: RoomModel

    const roomTypes = await this.roomTypePersistor.select()
    const length = roomTypes.length

    if (length === 0) throw new Error('There are room-types records')

    let randomType = 0

    for (let i = 0; i < limit; i++) {
      randomType = randomNumber(0, length - 1)
      room = await this.create(roomTypes[randomType].roomTypeId)
      rooms.push(room)
    }

    return rooms
  }

  /* Create single room record */
  async create(roomTypeId?: number): Promise<RoomModel> {
    return {
      code: `Room-${faker.random.alpha(10)}`,
      price: +faker.random.numeric(3, { bannedDigits: ['0'] }) * 100,
      roomTypeId,
    }
  }
}
