import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { IFactory } from '../types/IFactory'
import { RoomTypeModel } from '../models'

@Injectable()
export class RoomTypeFactory implements IFactory<Partial<RoomTypeModel>> {
  /* Generate random room-types records */
  async generate(limit: number = 10): Promise<Partial<RoomTypeModel>[]> {
    const roomTypes: Partial<RoomTypeModel>[] = []
    let roomType: Partial<RoomTypeModel>

    for (let i = 0; i < limit; i++) {
      roomType = await this.create()
      roomTypes.push(roomType)
    }

    return roomTypes
  }

  /* Create single room-type record */
  async create(): Promise<Partial<RoomTypeModel>> {
    return {
      description: faker.lorem.sentence(3),
    }
  }
}
