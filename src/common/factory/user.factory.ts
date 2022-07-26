import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { IFactory } from '../types/IFactory.type'
import { UserModel } from '../models'
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

    return users
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
}
