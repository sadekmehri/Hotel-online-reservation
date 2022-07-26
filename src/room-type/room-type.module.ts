import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RoomTypeController } from './controllers'
import { RoomTypeService } from './services'

@Module({
  imports: [PrismaModule],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
})
export class RoomTypeModule {}
