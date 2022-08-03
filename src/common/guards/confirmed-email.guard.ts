import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { AuthService } from 'src/auth/services/auth.service'
import { JwtPayload } from 'src/auth/types'

@Injectable()
export class ConfirmedEmailGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const { userId } = <JwtPayload>request.user

    const { isEmailConfirmed } = await this.authService.getAuthInfo(userId)

    if (!isEmailConfirmed)
      throw new HttpException(
        { message: `Please confirm your email first!` },
        HttpStatus.UNAUTHORIZED,
      )

    return true
  }
}
