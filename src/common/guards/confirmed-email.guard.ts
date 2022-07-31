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
export class ConfirmedEmailGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const { email } = <JwtPayload>request.user

    const { isEmailConfirmed } = await this.prismaService.users.findUnique({
      where: { email },
      select: {
        isEmailConfirmed: true,
      },
    })

    if (!isEmailConfirmed)
      throw new HttpException(
        { message: `Please confirm your email first!` },
        HttpStatus.UNAUTHORIZED,
      )

    return true
  }
}
