import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Jwt } from 'src/common/constants'
import { JwtPayload } from '../types'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  Jwt.ACCESS_TOKEN_STRATEGY,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Jwt.ACCESS_TOKEN_SECRET,
    })
  }

  validate(payload: JwtPayload) {
    return payload
  }
}
