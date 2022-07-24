import { Module } from '@nestjs/common'
import { UserFactory } from 'src/common/factory'
import { IFactory, IPersist } from 'src/common/interfaces'
import { UserPersistor } from 'src/common/persistors'
import { PrismaModule } from 'src/prisma/prisma.module'
import { SeederService } from './seeder.service'

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    SeederService,
    {
      provide: IPersist,
      useClass: UserPersistor,
    },
    {
      provide: IFactory,
      useClass: UserFactory,
    },
  ],
  exports: [SeederService],
})
export class SeederModule {}
