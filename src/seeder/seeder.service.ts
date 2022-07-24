import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Seed } from 'src/common/constants'
import { IPersist } from 'src/common/interfaces'

@Injectable()
export class SeederService<T> implements OnModuleInit {
  constructor(@Inject(IPersist) private readonly userPersistor: IPersist<T>) {}

  async onModuleInit() {
    await this.populate()
  }

  /* Insert records to database */
  async populate() {
    await this.userPersistor.insert(Seed.INSERT_USERS_RECORD)
  }
}
