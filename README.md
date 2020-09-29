# firestore-seeder

Commandline tool for seeding Firestore data

*This tool is WIP and not ready to be used yet*

## Install

#### npm

```bash
$ npm install firestore-seeder --save-dev
```

#### yarn

```bash
$ yarn add firestore-seeder -D
```

## Configuration

### Setting up project options

There are 3 ways to configure your project:

1. Use the CLI args
2. Use the `firestore-seeder` key in your package.json
3. Use environment variables

### CLI usage

```
$ firestore-seeder seed [options]
```

### Configuration using package.json

```json
{
  "name": "firestore-seeder-example",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "seed": "firestore-seeder seed"
  },
  "firestore-seeder": {
    "databaseUrl": "https://xxxxxx.firebaseio.com",
    "credential": "./secret/credential.json",
    "lang": "en"
    // ...
  },
  // ...
}
```

> NOTE:  
> The options in package.json should be in camelCase.  
> Also note that the CLI options takes precedence over the package.json config.

### Using the environment variables

Environment variables should be prefixed with `FSSEEDER_`.

The options below are currently supported:

- `FSSEEDER_SEED_DIR`
- `FSSEEDER_DATABASE_URL`
- `FSSEEDER_CREDENTIAL`
- `FSSEEDER_ID_KEY`
- `FSSEEDER_LANG`

> NOTE:  
> Environment variables takes precedence over the package.json config.

### Configuration priority

1. CLI Options (Highest priority)
2. Environment variables
3. package.json config (Lowest priority)

## Seeding

### Example seed file

```js
import { createSeeds, setLocale, name } from 'firestore-seeder'

export default createSeeds(100, (index) => ({
  _id: index + 1,
  firstName: name.firstName(),
  lastName: name.lastName(),
  subCollection: createSeeds(10, () => ({ key: 'value' }))
}))
```

## Options Reference

### `seedDir` [string]

Default: `'./seed'`

Path to directory containing the seed files

### `databaseUrl` [string]

Default: `''`

Firestore database URL

### `credential` [string]

Default: `'./serviceAccountCredentials.json'`

Path to firebase admin credentials json

### `fresh` [boolean]

Default: `false`

Remove all documents in collection before seeding

### `lang` [string]

Default: `'en'`

Seed data language

### `includeAll` [boolean]

Default: `true`

Flag to seed all collections

### `include` [string[]]

Default: `[]`

Collection name to seed
> NOTE: Only works if includeAll flag is set to `false`

### `exclude` [string[]]

Default: `[]`

Collection name to exclude from seed
> NOTE: Only works if includeAll flag is set to `true`

### `idKey` [string]

Default: `'_id'`

ID key of the seed data (defaults to '_id')
