import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthController } from './controllers'
import { AuthService } from './services'
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies'

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
