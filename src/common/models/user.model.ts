export interface UserModel {
  readonly userId: number
  firstName: string
  lastName: string
  email: string
  cin: string
  dob: Date
  password: string
  isEmailConfirmed: boolean
  refreshToken: string | null
  isActive: boolean
}

export const UserModel = Symbol('UserModel')
