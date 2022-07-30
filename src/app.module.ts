import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { getEnvPath } from './common/config/env.config'
import { mailerOption } from './common/config/mail-transport.config'
import { Path } from './common/constants'
import {
  HttpExceptionFilter,
  NotFoundExceptionFilter,
  ThrottlerExceptionFilter,
} from './common/filters'
import { AccessTokenGuard, RolesGuard } from './common/guards'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { EmailModule } from './email/email.module'
import { PrismaModule } from './prisma/prisma.module'
import { RoomTypeModule } from './room-type/room-type.module'
import { RoomModule } from './room/room.module'

const envFilePath: string = getEnvPath(Path.ROOT_PATH)

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MailerModule.forRoot(mailerOption),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    PrismaModule,
    AuthModule,
    RoomTypeModule,
    RoomModule,
    EmailModule,
    EmailConfirmationModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ThrottlerExceptionFilter },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
