import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { getEnvPath } from './common/config/env.config'
import { Path } from './common/constants'
import { HttpExceptionFilter, NotFoundExceptionFilter } from './common/filters'
import { AccessTokenGuard } from './common/guards'
import { PrismaModule } from './prisma/prisma.module'
import { RoomTypeModule } from './room-type/room-type.module'
import { RoomModule } from './room/room.module'
import { SeederModule } from './seeder/seeder.module'

const envFilePath: string = getEnvPath(Path.ROOT_PATH)

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    PrismaModule,
    AuthModule,
    RoomTypeModule,
    SeederModule,
    RoomModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
