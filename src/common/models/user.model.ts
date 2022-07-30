export interface UserModel {
  readonly userId?: number
  firstName: string
  lastName: string
  email: string
  cin?: string | null
  dob?: Date | null
  password: string
  isEmailConfirmed?: boolean
  refreshToken?: string | null
  isActive?: boolean
  isAdmin?: boolean
}

export const UserModel = Symbol('UserModel')
