import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from 'src/auth/types'

export const GetCurrentAuthId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest()
    const user = <JwtPayload>request.user

    return user.userId
  },
)
