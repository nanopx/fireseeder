import { getUserPath } from './getUserPath'
import { importJsonSync } from './importJson'

export interface FireseederConfig {
  seedDir: string
  databaseUrl: string
  credential: string
  idKey: string
  lang: string
  include: string[]
  exclude: string[]
  fresh: boolean
}

const defaultConfig: FireseederConfig = {
  seedDir: './seeds',
  databaseUrl: '',
  credential: './serviceAccountCredentials.json',
  idKey: '_id',
  lang: 'en',
  include: [],
  exclude: [],
  fresh: false,
}

export const collectUserConfig = (): FireseederConfig => {
  const userPkgPath = getUserPath('package.json')

  const pkgConfig: Partial<FireseederConfig> =
    (importJsonSync(userPkgPath) || {})['fireseeder'] ?? ({} as any)

  const envConfig: Partial<FireseederConfig> = {
    ...(process.env.FSSEEDER_SEED_DIR
      ? { seedDir: process.env.FSSEEDER_SEED_DIR }
      : {}),
    ...(process.env.FSSEEDER_DATABASE_URL
      ? { databaseUrl: process.env.FSSEEDER_DATABASE_URL }
      : {}),
    ...(process.env.FSSEEDER_CREDENTIAL
      ? { credential: process.env.FSSEEDER_CREDENTIAL }
      : {}),
    ...(process.env.FSSEEDER_ID_KEY
      ? { idKey: process.env.FSSEEDER_ID_KEY }
      : {}),
    ...(process.env.FSSEEDER_LANG ? { lang: process.env.FSSEEDER_LANG } : {}),
  }

  return {
    ...defaultConfig,
    ...pkgConfig,
    ...envConfig,
  }
}
