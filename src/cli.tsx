#!/usr/bin/env node
import React from 'react'
import meow from 'meow'
import { render } from 'ink'
import App from './ui/App'
import { Config, EnvConfig } from './types'

const cli = meow(
  `
  Usage
    $ firestore-seeder <seed>

  Options
    --seed-dir, -d  Path to directory containing the seed files
    --database-url, -u  Firestore database URL
    --credential, -c  Path to firebase admin credentials json path
    --include-all, -a  Flag to seed all collections
    --include, -i  Collection name to seed (Only works if --include-all flag is set to false)

  Examples
    $ firestore-seeder seed -a
    Seed all data to firestore
  `,
  {
    flags: {
      seedDir: {
        type: 'string',
        alias: 'd',
        default: './seeds',
      },
      databaseUrl: {
        type: 'string',
        alias: 'u',
        default: '',
      },
      credential: {
        type: 'string',
        alias: 'c',
        default: './firebase-credential.json',
      },
      includeAll: {
        type: 'boolean',
        alias: 'a',
        default: false,
      },
      include: {
        type: 'string',
        alias: 'i',
        // @ts-ignore
        default: [],
        isMultiple: true,
      },
      help: {
        alias: 'h',
      },
      version: {
        alias: 'v',
      },
    },
  }
)

if (!['seed'].includes(cli.input[0])) {
  // Exit with help
  cli.showHelp()
}

const pkgConfig: Partial<Config> = (cli.pkg['firestore-seeder'] || {}) as any
const envConfig: Partial<EnvConfig> = {
  ...(process.env.FSSEEDER_SEED_DIR
    ? { seedDir: process.env.FSSEEDER_SEED_DIR }
    : {}),
  ...(process.env.FSSEEDER_DATABASE_URL
    ? { seedDir: process.env.FSSEEDER_DATABASE_URL }
    : {}),
  ...(process.env.FSSEEDER_CREDENTIAL
    ? { seedDir: process.env.FSSEEDER_CREDENTIAL }
    : {}),
}
const config: Partial<Config> = { ...pkgConfig, ...envConfig, ...cli.flags }

render(<App command={cli.input[0]} {...(config as any)} />)
