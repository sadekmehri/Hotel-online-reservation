export type JwtPayload = {
  userId: number
  email: string
  isEmailConfirmed: boolean
  isActive: boolean
  isAdmin: boolean
}
