import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Seed } from 'src/common/constants'
import { RoomModel, RoomTypeModel, UserModel } from 'src/common/models'
import { IPersist, PersistorTypes } from 'src/common/types'

const { IUserPersistor, IRoomTypePersistor, IRoomPersistor } = PersistorTypes

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @Inject(IUserPersistor)
    private readonly userPersistor: IPersist<UserModel>,
    @Inject(IRoomTypePersistor)
    private readonly roomTypePersistor: IPersist<RoomTypeModel>,
    @Inject(IRoomPersistor)
    private readonly roomPersistor: IPersist<RoomModel>,
  ) {}

  /* Insert records to database */
  async onModuleInit() {
    await Promise.all([
      this.userPersistor.insert(Seed.USER_RECORDS),
      this.roomTypePersistor.insert(Seed.ROOM_TYPE_RECORDS),
      this.roomPersistor.insert(Seed.ROOM_RECORDS),
    ])
  }
}
