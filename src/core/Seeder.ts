import admin from 'firebase-admin'
import { readdirSync } from 'fs'
import { getUserPath } from '@/lib/utils/getUserPath'
import { importEsmSync } from '@/lib/utils/importEsm'
import { basename, extname } from 'path'

export interface SeederOptions {
  seedDir: string
  idKey: string
}

export const defaultSeederOptions: SeederOptions = {
  seedDir: './seeds',
  idKey: '_id',
}

export interface SeedOptions {}

export const defaultSeedOptions: SeedOptions = {}

// private clearCollection(collection) {}
// private clearAllCollections() {}

const ALLOWED_EXTENSIONS = ['js', 'json']

const findSeedFiles = (seedDir: string) => {
  let seedFiles: string[]

  try {
    seedFiles = readdirSync(getUserPath(seedDir))
  } catch (e) {
    throw new Error(`Cannot find seed directory: ${seedDir}`)
  }

  seedFiles = seedFiles.filter((seedFile) =>
    ALLOWED_EXTENSIONS.includes(extname(seedFile).replace('.', ''))
  )

  if (seedFiles.length === 0) {
    throw new Error(`Cannot find any seed files in ${seedDir}`)
  }

  return seedFiles
}

class Collection {
  public name: string
  private seedData: any[]

  /**
   * Collection constructor
   * @param firestore Initiated firestore instance
   * @param filePath  Absolute path to file
   */
  constructor(private firestore: admin.firestore.Firestore, filePath: string) {
    this.name = basename(filePath, extname(filePath))

    const data = importEsmSync(filePath)

    if (
      !Array.isArray(data) ||
      (data.length > 0 && typeof data[0] !== 'object')
    ) {
      throw new Error(
        `Seed data for collection '${this.name}' must export array of objects`
      )
    }

    this.seedData = data
  }

  get data() {
    return this.seedData
  }

  // seed() {}
  // deleteAllData() {}
}

export class Seeder {
  private collections: Collection[] = []

  /**
   * Seeder constructor
   * @param firestore Initiated firestore instance
   * @param options   Seeder options
   */
  constructor(
    private firestore: admin.firestore.Firestore,
    private options: SeederOptions = defaultSeederOptions
  ) {
    this.collections = findSeedFiles(options.seedDir).map(
      (file) => new Collection(firestore, getUserPath(options.seedDir, file))
    )
  }

  public seed(o: SeedOptions = defaultSeedOptions) {
    console.log(
      this.collections.map((c) => c.data),
      o
    )
  }

  public getCollection(name: string) {
    return this.collections.find((collection) => collection.name === name)
  }

  // public seed(collectionNames: string | string[]) {
  //   const _names =
  //     typeof collectionNames === 'string' ? [collectionNames] : collectionNames

  //   const collections = _names.map((collectionName) =>
  //     this.getCollection(collectionName)
  //   )
  // }

  // public seedAll() {}
}
