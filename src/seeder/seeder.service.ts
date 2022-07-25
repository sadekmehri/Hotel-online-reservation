import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Seed } from 'src/common/constants'
import { RoomTypePersistor, UserPersistor } from 'src/common/persistors'
import { IPersist, PersistorTypes } from 'src/common/types'

const { IUserPersistor, IRoomTypePersistor } = PersistorTypes
@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @Inject(IUserPersistor)
    private readonly userPersistor: IPersist<UserPersistor>,
    @Inject(IRoomTypePersistor)
    private readonly roomTypePersistor: IPersist<RoomTypePersistor>,
  ) {}

  /* Insert records to database */
  async onModuleInit() {
    await this.userPersistor.insert(Seed.INSERT_USER_RECORDS)
    await this.roomTypePersistor.insert(Seed.INSERT_ROOM_TYPE_RECORDS)
  }
}
