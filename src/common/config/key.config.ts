export = (): void => {
  if (!process.env.JWT_ACCESS_TOKEN_SECRET)
    throw new Error('FATAL ERROR: Jwt access token secret is not defined!')

  if (!process.env.JWT_REFRESH_TOKEN_SECRET)
    throw new Error('FATAL ERROR: Jwt refresh token secret is not defined!')
}
