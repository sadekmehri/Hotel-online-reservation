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
export class ActiveAccountGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const { userId } = <JwtPayload>request.user

    const { isActive } = await this.authService.getAuthInfo(userId)

    if (!isActive)
      throw new HttpException(
        { message: `Your account is blocked!` },
        HttpStatus.UNAUTHORIZED,
      )

    return true
  }
}
