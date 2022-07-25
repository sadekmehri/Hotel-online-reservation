import { Module } from '@nestjs/common'
import { RoomTypeFactory, UserFactory } from 'src/common/factory'
import { RoomTypePersistor, UserPersistor } from 'src/common/persistors'
import { FactoryTypes, PersistorTypes } from 'src/common/types'
import { PrismaModule } from 'src/prisma/prisma.module'
import { SeederService } from './seeder.service'

const { IUserPersistor, IRoomTypePersistor } = PersistorTypes
const { IUserFactory, IRoomTypeFactory } = FactoryTypes
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    SeederService,
    { provide: IUserPersistor, useClass: UserPersistor },
    { provide: IUserFactory, useClass: UserFactory },
    { provide: IRoomTypePersistor, useClass: RoomTypePersistor },
    { provide: IRoomTypeFactory, useClass: RoomTypeFactory },
  ],
  exports: [SeederService],
})
export class SeederModule {}
