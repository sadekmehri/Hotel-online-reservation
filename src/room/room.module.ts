import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RoomTypeService } from 'src/room-type/services/room-type.service'
import { RoomController } from './controllers/room.controller'
import { RoomService } from './services/room.service'

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService, RoomTypeService],
})
export class RoomModule {}
