import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { JwtPayload } from 'src/auth/types'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ActiveAccountGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const { email } = <JwtPayload>request.user

    const { isActive } = await this.prismaService.users.findUnique({
      where: { email },
      select: {
        isActive: true,
      },
    })

    if (!isActive)
      throw new HttpException(
        { message: `Your account is blocked!` },
        HttpStatus.UNAUTHORIZED,
      )

    return true
  }
}
