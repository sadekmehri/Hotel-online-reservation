import { Jwt } from '../constants'

export = (): void => {
  if (!Jwt.ACCESS_TOKEN_SECRET)
    throw new Error('FATAL ERROR: Jwt access token secret is not defined!')

  if (!Jwt.REFRESH_TOKEN_SECRET)
    throw new Error('FATAL ERROR: Jwt refresh token secret is not defined!')

  if (!Jwt.EMAIL_TOKEN_SECRET)
    throw new Error('FATAL ERROR: Email token secret is not defined!')
}
