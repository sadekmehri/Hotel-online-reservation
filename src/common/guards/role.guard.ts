import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { JwtPayload } from 'src/auth/types'
import { Role } from '../constants'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    // Check if the required roles are defined
    if (!requiredRoles) return true

    // Get the user payload from request object
    const request = context.switchToHttp().getRequest()
    const user = <JwtPayload>request.user

    return requiredRoles.some((role) => [+user.isAdmin].includes(role))
  }
}
