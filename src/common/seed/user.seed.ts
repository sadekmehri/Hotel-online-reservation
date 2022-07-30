import { faker } from '@faker-js/faker'
import { AdminCredentials } from '../constants'
import { UserModel } from '../models'
import { hash } from '../utils/bcrypt.util'

/* Generate random users */
export const generateUsers = async (
  limit: number = 10,
): Promise<UserModel[]> => {
  const users: UserModel[] = []

  for (let i = 0; i < limit; i++) {
    const user = await create()
    users.push(user)
  }

  const admin = await createAdmin()
  return [admin].concat(users)
}

/* Create single user */
const create = async (): Promise<UserModel> => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    dob: faker.date.birthdate(),
    password: await hash(faker.internet.password()),
    cin: faker.random.numeric(8),
  }
}

/* Create single admin */
const createAdmin = async (): Promise<UserModel> => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: AdminCredentials.EMAIL,
    password: await hash(AdminCredentials.PASSWORD),
    isAdmin: true,
    isEmailConfirmed: true,
  }
}
