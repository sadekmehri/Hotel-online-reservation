import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { RoomTypeService } from 'src/room-type/services'
import { RoomController } from './controllers'
import { RoomService } from './services'

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService, RoomTypeService],
})
export class RoomModule {}
