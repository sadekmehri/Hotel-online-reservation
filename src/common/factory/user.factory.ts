import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { AdminCredentials } from '../constants'
import { UserModel } from '../models'
import { IFactory } from '../types/IFactory.type'
import { hash } from '../utils/bcrypt.util'

@Injectable()
export class UserFactory implements IFactory<UserModel> {
  /* Generate random users */
  async generate(limit: number = 10): Promise<UserModel[]> {
    const users: UserModel[] = []
    let user: UserModel

    for (let i = 0; i < limit; i++) {
      user = await this.create()
      users.push(user)
    }

    const admin = await this.createAdmin()

    return users.concat([admin])
  }

  /* Create single user */
  async create(): Promise<UserModel> {
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
  async createAdmin(): Promise<UserModel> {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: AdminCredentials.EMAIL,
      password: await hash(AdminCredentials.PASSWORD),
      isAdmin: true,
      isEmailConfirmed: true,
    }
  }
}
