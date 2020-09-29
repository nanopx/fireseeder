import admin from 'firebase-admin'
import { readdirSync } from 'fs'
import { basename, extname } from 'path'
import { EventEmitter } from 'events'
import { getUserPath } from '@/lib/utils/getUserPath'
import { importEsmSync } from '@/lib/utils/importEsm'
// import { CollectionSeed } from './CollectionSeed'

export interface SeederOptions {
  seedDir: string
  idKey: string
  fresh: boolean
}

export const defaultSeederOptions: SeederOptions = {
  seedDir: './seeds',
  idKey: '_id',
  fresh: false,
}

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

const getCollectionName = (path: string) => {
  return basename(path, extname(path))
}

interface CollectionMetadata {
  name: string
  path: string
}

interface CollectionMetadataMap {
  [collectionName: string]: CollectionMetadata
}

const collectCollectionMetadata = (seedDir: string): CollectionMetadataMap => {
  const filenames = findSeedFiles(seedDir)

  return filenames.reduce((acc, filename) => {
    const collectionName = getCollectionName(filename)
    const filePath = getUserPath(seedDir, filename)
    return {
      ...acc,
      [collectionName]: {
        name: collectionName,
        path: filePath,
      },
    }
  }, {})
}

const importCollectionSeed = (path: string) => {
  const content = importEsmSync(path)

  if (
    !Array.isArray(content) ||
    (content.length > 0 && typeof content[0] !== 'object')
  ) {
    const name = getCollectionName(path)
    throw new Error(
      `Seed data for collection '${name}' must export array of objects`
    )
  }

  return content
}

export class Seeder extends EventEmitter {
  private collectionMetadataMap: CollectionMetadataMap

  /**
   * Seeder constructor
   * @param firestore Initiated firestore instance
   * @param options   Seeder options
   */
  constructor(
    private firestore: admin.firestore.Firestore,
    private options: SeederOptions = defaultSeederOptions
  ) {
    super()
    const seedDir = options.seedDir
    this.collectionMetadataMap = collectCollectionMetadata(seedDir)
  }

  private async execute(collectionMetadata: CollectionMetadata) {
    const { name, path } = collectionMetadata
    const { idKey, fresh } = this.options
    const seedData = importCollectionSeed(path)
    const emitPayload = { collection: name }

    this.emit('seed:start', emitPayload)
    this.emit('seed:end', emitPayload)
  }

  private async executeAll(collectionMetadataList: CollectionMetadata[]) {
    return await Promise.all(
      collectionMetadataList.map((metadata) => this.execute(metadata))
    )
  }

  public seed(collections: string | string[]) {
    const names = typeof collections === 'string' ? [collections] : collections

    const targetCollectionMetadata = names.map(
      (collectionName) => this.collectionMetadataMap[collectionName]
    )

    // Check if all metadata exists
    const notFoundIndex = targetCollectionMetadata.findIndex((data) => !data)
    if (notFoundIndex !== -1) {
      throw new Error(`Collection '${names[notFoundIndex]}' not found.`)
    }

    this.executeAll(targetCollectionMetadata)
  }

  public seedAll() {
    const names = Object.keys(this.collectionMetadataMap)

    const targetCollectionMetadata = names.map(
      (collectionName) => this.collectionMetadataMap[collectionName]
    )

    this.executeAll(targetCollectionMetadata)
  }
}
