#!/usr/bin/env node

import React from 'react'
import meow from 'meow'
import { render } from 'ink'
import App from '@/ui/App'
import { collectUserConfig } from '@/lib/utils/collectUserConfig'
import { setLocale } from './core/Faker'

const userConfig = collectUserConfig()

const cli = meow(
  `
  Usage
    $ firestore-seeder <seed>

  Options
    --seed-dir, -d      Path to directory containing the seed files
    --database-url, -u  Firestore database URL
    --credential, -c    Path to firebase admin credentials json
    --fresh , -f        Remove all documents in collection before seeding
    --include, -i       Collection name to seed (All collections are seeded if not specified)
    --exclude, -e       Collection name to exclude
    --lang, -l          Seed data language
    --id-key, -k        ID key of the seed data (defaults to '_id')

  Examples
    $ firestore-seeder seed -a
    Seed all data to firestore
  `,
  {
    flags: {
      seedDir: {
        type: 'string',
        alias: 'd',
        default: userConfig.seedDir,
      },
      databaseUrl: {
        type: 'string',
        alias: 'u',
        default: userConfig.databaseUrl,
      },
      credential: {
        type: 'string',
        alias: 'c',
        default: userConfig.credential,
      },
      fresh: {
        type: 'boolean',
        alias: 'f',
        default: userConfig.fresh,
      },
      include: {
        type: 'string',
        alias: 'i',
        // @ts-ignore
        default: userConfig.include,
        isMultiple: true,
      },
      exclude: {
        type: 'string',
        alias: 'e',
        // @ts-ignore
        default: userConfig.exclude,
        isMultiple: true,
      },
      lang: {
        type: 'string',
        alias: 'l',
        default: userConfig.lang,
      },
      idKey: {
        type: 'string',
        alias: 'k',
        default: userConfig.idKey,
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

const { flags, input } = cli as any

setLocale(flags.lang)

render(<App command={input[0]} options={{ ...(flags as any) }} />)
