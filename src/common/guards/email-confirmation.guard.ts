import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { IRequestWithUser } from '../types'

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequestWithUser = context.switchToHttp().getRequest()

    if (!request.user?.isEmailConfirmed)
      throw new HttpException(
        { message: `Please confirm your email first'!` },
        HttpStatus.UNAUTHORIZED,
      )

    return true
  }
}
