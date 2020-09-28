# firestore-seeder

Commandline tool for seeding Firestore data

*This tool is WIP and not ready to be used yet*

## Install

```bash
$ npm install --global firestore-seeder
```

```bash
$ yarn global add firestore-seeder
```


## CLI

```
$ firestore-seeder --help

  Commandline tool for seeding Firestore

  Usage
    $ firestore-seeder <seed>

  Options
    --seed-dir, -d  Path to directory containing the seed files
    --database-url, -u  Firestore database URL
    --credential, -c  Path to firebase admin credentials json path
    --include-all, -a  Flag to seed all collections
    --include, -i  Collection name to seed (Only works if --include-all flag is set to false)

  Examples
    $ firestore-seeder
```
