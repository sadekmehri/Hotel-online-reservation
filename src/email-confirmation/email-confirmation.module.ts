import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from 'src/auth/auth.module'
import { EmailModule } from 'src/email/email.module'
import { EmailConfirmationController } from './controllers/email-confirmation.controller'
import { EmailConfirmationService } from './services/email-confirmation.service'

@Module({
  imports: [JwtModule.register({}), EmailModule, AuthModule],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
