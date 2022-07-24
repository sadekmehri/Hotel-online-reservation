import * as bcrypt from 'bcrypt'

/* Hash text */
export const hash = async (
  password: string,
  salt: number = 10,
): Promise<string> => {
  return await bcrypt.hash(password, salt)
}

/* Compare plain text to the hashed version */
export const compareHashToText = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}
