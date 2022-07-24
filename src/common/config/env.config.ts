import { existsSync } from 'fs'
import { resolve } from 'path'
import { Environment } from '../constants'

export function getEnvPath(dest: string): string {
  const env: string = getEnv()
  const fallback: string = resolve(`${dest}/.env.development`)
  const filename: string = getEnvFileName(env)
  let filePath: string = resolve(`${dest}/${filename}`)

  if (!existsSync(filePath)) {
    filePath = fallback
  }

  return filePath
}

function getEnvFileName(env: string): string {
  switch (env) {
    case Environment.PRODUCTION:
      return `.env.${Environment.PRODUCTION}`

    case Environment.TEST:
      return `.env.${Environment.TEST}`

    default:
      return `.env.${Environment.DEVELOPMENT}`
  }
}

export function getEnv(): string {
  const env: string | undefined = process.env.NODE_ENV
  return env?.trim()?.toLowerCase() ?? Environment.DEVELOPMENT
}

export function isProdution(): boolean {
  const env: string = getEnv()
  return env === Environment.PRODUCTION
}

export function isDevelopment(): boolean {
  const env: string = getEnv()
  return env === Environment.DEVELOPMENT
}

export function isTesting(): boolean {
  const env: string = getEnv()
  return env === Environment.TEST
}
