import { PrismaClient } from '@prisma/client'
import { Seed } from 'src/common/constants'
import { generateCities } from './city.seed'
import { generateCountires } from './country.seed'
import { generateRoomTypes } from './room-type.seed'
import { generateRooms } from './room.seed'
import { generateUsers } from './user.seed'

const prisma = new PrismaClient()

const displayMessage = (message: string): void => {
  console.log(message)
}

/* User seeder */
const userSeeder = async (): Promise<void> => {
  const users = await generateUsers(Seed.USER_RECORDS)
  await prisma.users.createMany({ data: users, skipDuplicates: true })
  displayMessage('User seed done!')
}

/* Room-type seeder */
const roomTypeSeeder = async (): Promise<void> => {
  const roomTypes = await generateRoomTypes(Seed.ROOM_TYPE_RECORDS)
  await prisma.roomtypes.createMany({ data: roomTypes, skipDuplicates: true })
  displayMessage('Room type seed done!')
}

/* Room seeder */
const roomSeeder = async (): Promise<void> => {
  const roomTypeCount = await prisma.roomtypes.count()
  const rooms = await generateRooms(Seed.ROOM_RECORDS, roomTypeCount)
  await prisma.rooms.createMany({ data: rooms, skipDuplicates: true })
  displayMessage('Room seed done!')
}

/* Country seeder */
const countrySeeder = async (): Promise<void> => {
  const countries = await generateCountires(Seed.COUNTRY_RECORDS)
  await prisma.countries.createMany({ data: countries, skipDuplicates: true })
  displayMessage('Country seed done!')
}

/* City seeder */
const citySeeder = async (): Promise<void> => {
  const countryCount = await prisma.countries.count()
  const cities = await generateCities(Seed.CITY_RECORDS, countryCount)
  await prisma.cities.createMany({ data: cities, skipDuplicates: true })
  displayMessage('City seed done!')
}

/* Main function */
const main = async (): Promise<void> => {
  await userSeeder()
  await roomTypeSeeder()
  await roomSeeder()
  await countrySeeder()
  await citySeeder()
}

main()
  .catch((e: Error) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
