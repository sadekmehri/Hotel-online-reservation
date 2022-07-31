import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { Jwt } from 'src/common/constants'

@Injectable()
export class AccessTokenGuard extends AuthGuard(Jwt.ACCESS_TOKEN_STRATEGY) {
  constructor(private readonly reflactor: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflactor.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])

    return isPublic ? true : super.canActivate(context)
  }
}
