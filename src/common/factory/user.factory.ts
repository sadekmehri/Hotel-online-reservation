import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { IFactory } from '../types/IFactory'
import { UserModel } from '../models'
import { hash } from '../utils/bcrypt.util'

@Injectable()
export class UserFactory implements IFactory<Partial<UserModel>> {
  /* Generate random users */
  async generate(limit: number = 10): Promise<Partial<UserModel>[]> {
    const users: Partial<UserModel>[] = []
    let user: Partial<UserModel>

    for (let i = 0; i < limit; i++) {
      user = await this.create()
      users.push(user)
    }

    return users
  }

  /* Create single user */
  async create(): Promise<Partial<UserModel>> {
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
