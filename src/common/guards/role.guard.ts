import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from 'src/auth/services/auth.service'
import { JwtPayload } from 'src/auth/types'
import { Role } from '../constants'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    // Check if the required roles are defined
    if (!requiredRoles) return true

    // Get the user payload from request object
    const request = context.switchToHttp().getRequest()
    const { userId } = <JwtPayload>request.user

    const user = await this.authService.getAuthInfo(userId)

    if (!user)
      throw new HttpException(
        { message: `User does not exist!` },
        HttpStatus.NOT_FOUND,
      )

    return requiredRoles.some((role) => [+user.isAdmin].includes(role))
  }
}
