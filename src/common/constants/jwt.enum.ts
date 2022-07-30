export class Jwt {
  static readonly ACCESS_TOKEN_SECRET: string =
    process.env.JWT_ACCESS_TOKEN_SECRET
  static readonly REFRESH_TOKEN_SECRET: string =
    process.env.JWT_REFRESH_TOKEN_SECRET
  static readonly EMAIL_TOKEN_SECRET: string =
    process.env.JWT_EMAIL_TOKEN_SECRET
  static readonly EXPIRES_IN_EMAIL_TOKEN: number = 900
  static readonly EXPIRES_IN_ACCESS_TOKEN: number = 900
  static readonly EXPIRES_IN_REFRESH_TOKEN: number = 604800
  static readonly ACCESS_TOKEN_STRATEGY: string = 'jwt'
  static readonly REFRESH_TOKEN_STRATEGY: string = 'jwt-refresh'
}
