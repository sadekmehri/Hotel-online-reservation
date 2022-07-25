import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RoomTypeController } from './controllers/room-type.controller'
import { RoomTypeService } from './services/room-type.service'

@Module({
  imports: [PrismaModule],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
})
export class RoomTypeModule {}
