import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Jwt } from 'src/common/constants'
import { JwtPayload, JwtPayloadWithRt } from '../types'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  Jwt.REFRESH_TOKEN_STRATEGY,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Jwt.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken: string = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim()

    if (!refreshToken)
      throw new HttpException(
        { message: `Refresh token malformed!` },
        HttpStatus.FORBIDDEN,
      )

    return {
      ...payload,
      refreshToken,
    }
  }
}
