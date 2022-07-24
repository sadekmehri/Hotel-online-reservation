import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayloadWithRt } from '../../auth/types'

export const GetCurrentAuth = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return !data ? request.user : request.user[data]
  },
)
