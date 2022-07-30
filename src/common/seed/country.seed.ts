import { faker } from '@faker-js/faker'
import { CountryModel } from '../models'

/* Generate random country records */
export const generateCountires = async (
  limit: number = 10,
): Promise<CountryModel[]> => {
  const countries: CountryModel[] = []

  for (let i = 0; i < limit; i++) {
    const country = await create()
    countries.push(country)
  }

  return countries
}

/* Create single country record */
const create = async (): Promise<CountryModel> => {
  return {
    name: faker.random.alpha(10),
  }
}
