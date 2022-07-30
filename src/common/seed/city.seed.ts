import { faker } from '@faker-js/faker'
import { CityModel } from '../models'
import { randomNumber } from '../utils/random.util'

/* Generate random city records */
export const generateCities = async (
  limit: number = 10,
  countryCount: number,
): Promise<CityModel[]> => {
  const cities: CityModel[] = []

  for (let i = 0; i < limit; i++) {
    const randomCountry = randomNumber(0, countryCount)
    const city = await create(randomCountry)
    cities.push(city)
  }

  return cities
}

/* Create single city record */
const create = async (countryId: number): Promise<CityModel> => {
  return {
    name: faker.random.alpha(10),
    countryId,
  }
}
