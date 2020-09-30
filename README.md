# firestore-seeder

Commandline tool for seeding Firestore data

*This tool is WIP and not ready to be used yet*

## Features

- Supports all firestore data types including GeoPoint, Ref, etc.
- Supports firestore subcollections and nested subcollections
- Easily create complex seed data with random values
- Change seed data language
- Clear collections/subcollections before seeding
- Seed data merging

## Getting Started

Install firestore-seeder using npm:

```bash
$ npm install firestore-seeder --save-dev
```

or yarn:

```bash
$ yarn add firestore-seeder -D
```

Then, download the Firebase Admin SDK json secret from the Firebase console, and place it somewhere in your project directory.

Create `seeds` directory in your project root (where your package.json is created), and add your config inside package.json:
```json
"firestore-seeder": {
  "seedDir": "./seeds",
  "databaseUrl": "https://xxxxxx.firebaseio.com",
  "credential": "./path/to/credential.json"
},
```

Finally, [create seed files](#creating-seed-files) inside `./seeds` and run:
```bash
$ firestore-seeder seed
```

## Configuration

### Setting up project options

There are 3 ways to configure your project:

1. Use the CLI options
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
    "seed": "firestore-seeder seed --fresh"
  },
  "firestore-seeder": {
    "databaseUrl": "https://xxxxxx.firebaseio.com",
    "credential": "./secret/credential.json",
    "lang": "en"
  },
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

## Creating seed files

### Example seed file

```js
import { mapCollection, mapSubCollection, ref, geoPoint, name } from 'firestore-seeder'

export default mapCollection(10, (index) => ({
  _id: index + 1,
  firstName: name.firstName(),
  lastName: name.lastName(),
  ref: ref('/mod/1'),
  geopoint: geoPoint({ lat: 1000, lng: 1000 }),
  arr: ['a', 'b', 'c'],
  map: { a: 'b', c: 'd' },
  subCollection: mapSubCollection(4, () => ({ key: 'value' }))
}))
```

## Options Reference

### `seedDir` [string]

Default: `'./seeds'`

Path to directory containing the seed files

### `databaseUrl` [string]

Default: `''`

Firestore database URL

### `credential` [string]

Default: `'./serviceAccountCredentials.json'`

Path to firebase admin credentials json

### `fresh` [boolean]

Default: `false`

Remove all documents in collection before seeding.

If the fresh option is set to `false`, firestore-seeder will:

1. Automatically create new data if the id is specified,
2. Otherwise it will merge the seed data by id

### `lang` [string]

Default: `'en'`

Seed data language.

firestore-seeder uses [faker.js](https://github.com/Marak/faker.js) under the hood, check [here](https://github.com/Marak/faker.js/tree/master/locale) for locales available.

### `include` [string[]]

Default: `[]`

Collection name to seed (All collections are seeded if not specified)

### `exclude` [string[]]

Default: `[]`

Collection name to exclude from seed

### `idKey` [string]

Default: `'_id'`

ID key of the seed data.

The `idKey` option can be specified in various places:

1. (Highest priority) Seed file's `idKey` option specified in each of these API: `mapCollection`, `mapSubCollection`, `collection`, `document`, `subCollection`
1. CLI Option
2. Environment variable `FSSEEDER_ID_KEY`
3. (Lowest priority) package.json config

> NOTE: If the id is not specified in the seed data, a random ID will be created by firestore.

