import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { IFactory } from '../types/IFactory.type'
import { RoomTypeModel } from '../models'

@Injectable()
export class RoomTypeFactory implements IFactory<RoomTypeModel> {
  /* Generate random room-types records */
  async generate(limit: number = 10): Promise<RoomTypeModel[]> {
    const roomTypes: RoomTypeModel[] = []
    let roomType: RoomTypeModel

    for (let i = 0; i < limit; i++) {
      roomType = await this.create()
      roomTypes.push(roomType)
    }

    return roomTypes
  }

  /* Create single room-type record */
  async create(): Promise<RoomTypeModel> {
    return {
      description: faker.lorem.word(4),
    }
  }
}
