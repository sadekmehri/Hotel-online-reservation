import { AuthGuard } from '@nestjs/passport'
import { Jwt } from 'src/common/constants'

export class RefreshTokenGuard extends AuthGuard(Jwt.REFRESH_TOKEN_STRATEGY) {
  constructor() {
    super()
  }
}
