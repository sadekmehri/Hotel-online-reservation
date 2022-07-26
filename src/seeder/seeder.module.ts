import { Module } from '@nestjs/common'
import { RoomFactory, RoomTypeFactory, UserFactory } from 'src/common/factory'
import {
  RoomPersistor,
  RoomTypePersistor,
  UserPersistor,
} from 'src/common/persistors'
import { FactoryTypes, PersistorTypes } from 'src/common/types'
import { PrismaModule } from 'src/prisma/prisma.module'
import { SeederService } from './seeder.service'

const { IUserPersistor, IRoomTypePersistor, IRoomPersistor } = PersistorTypes
const { IUserFactory, IRoomTypeFactory, IRoomFactory } = FactoryTypes
@Module({
  imports: [PrismaModule],
  providers: [
    SeederService,
    { provide: IUserPersistor, useClass: UserPersistor },
    { provide: IUserFactory, useClass: UserFactory },
    { provide: IRoomTypePersistor, useClass: RoomTypePersistor },
    { provide: IRoomTypeFactory, useClass: RoomTypeFactory },
    { provide: IRoomPersistor, useClass: RoomPersistor },
    { provide: IRoomFactory, useClass: RoomFactory },
  ],
  exports: [SeederService],
})
export class SeederModule {}
