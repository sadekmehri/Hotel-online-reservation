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

const timeExecution = (endTime: number, startTime: number): number => {
  return (endTime - startTime) / 1000
}

/* User seeder */
const userSeeder = async (): Promise<void> => {
  const startTime = new Date().getTime()
  const users = await generateUsers(Seed.USER_RECORDS)
  await prisma.users.createMany({ data: users, skipDuplicates: true })
  const endTime = new Date().getTime()
  displayMessage(
    `User seed: time taken => ${timeExecution(endTime, startTime)} seconds`,
  )
}

/* Room-type seeder */
const roomTypeSeeder = async (): Promise<void> => {
  const startTime = new Date().getTime()
  const roomTypes = await generateRoomTypes(Seed.ROOM_TYPE_RECORDS)
  await prisma.roomtypes.createMany({ data: roomTypes, skipDuplicates: true })
  const endTime = new Date().getTime()
  displayMessage(
    `Room type: time taken => ${timeExecution(endTime, startTime)} seconds`,
  )
}

/* Room seeder */
const roomSeeder = async (): Promise<void> => {
  const startTime = new Date().getTime()
  const roomTypeCount = await prisma.roomtypes.count()
  const rooms = await generateRooms(Seed.ROOM_RECORDS, roomTypeCount)
  await prisma.rooms.createMany({ data: rooms, skipDuplicates: true })
  const endTime = new Date().getTime()
  displayMessage(
    `Room seed: time taken => ${timeExecution(endTime, startTime)} seconds`,
  )
}

/* Country seeder */
const countrySeeder = async (): Promise<void> => {
  const startTime = new Date().getTime()
  const countries = await generateCountires(Seed.COUNTRY_RECORDS)
  await prisma.countries.createMany({ data: countries, skipDuplicates: true })
  const endTime = new Date().getTime()
  displayMessage(
    `Country seed: time taken => ${timeExecution(endTime, startTime)} seconds`,
  )
}

/* City seeder */
const citySeeder = async (): Promise<void> => {
  const startTime = new Date().getTime()
  const countryCount = await prisma.countries.count()
  const cities = await generateCities(Seed.CITY_RECORDS, countryCount)
  await prisma.cities.createMany({ data: cities, skipDuplicates: true })
  const endTime = new Date().getTime()
  displayMessage(
    `City seed: time taken => ${timeExecution(endTime, startTime)} seconds`,
  )
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
