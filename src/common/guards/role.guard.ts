import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtPayload } from 'src/auth/types'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from '../constants'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
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
    const { email } = <JwtPayload>request.user

    const user = await this.prismaService.users.findUnique({
      where: { email },
      select: {
        isAdmin: true,
      },
    })

    return requiredRoles.some((role) => [+user.isAdmin].includes(role))
  }
}
