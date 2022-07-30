import { Request } from 'express'
import { UserModel } from 'src/common/models'

export interface IRequestWithUser extends Request {
  user: UserModel
}

export const IRequestWithUser = Symbol('IRequestWithUser')
