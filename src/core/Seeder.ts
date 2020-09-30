import admin from 'firebase-admin'
import { readdirSync } from 'fs'
import { basename, extname } from 'path'
import { EventEmitter } from 'events'
import { getUserPath } from '@/lib/utils/getUserPath'
import { importEsmSync } from '@/lib/utils/importEsm'
import { Collection } from './nodes/Collection'
import { SubCollection } from './nodes/SubCollection'
import { convertDocumentToFirestoreData } from '@/lib/utils/convertDocumentToFirestoreData'

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

const ALLOWED_EXTENSIONS = ['js']

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
  const name = getCollectionName(path)

  let file
  try {
    file = importEsmSync(path)
  } catch (e) {
    throw new Error(
      `Error while loading collection seed '${name}': ${e.message}`
    )
  }

  const { default: collection } = file

  if (!(collection instanceof Collection)) {
    throw new Error(
      `Seed data for collection '${name}' must export an instance of Collection. Make sure you're using the 'mapCollection' helper.`
    )
  }

  return { collection } as {
    collection: Collection
  }
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

  private async writeCollection(
    ref: FirebaseFirestore.CollectionReference,
    collection: Collection | SubCollection,
    idKey: string
  ): Promise<number> {
    const batch = this.firestore.batch()

    const setCollectionToBatch = (
      collectionRef: FirebaseFirestore.CollectionReference,
      c: Collection | SubCollection
    ) => {
      c.forEach((doc) => {
        const id = doc.getId(idKey)

        const docRef = id ? collectionRef.doc(id) : collectionRef.doc()
        const data = convertDocumentToFirestoreData(this.firestore, doc)

        batch.set(docRef, data, { merge: true })

        const subCollections = doc.getSubCollectionEntries()
        subCollections.forEach(([name, subCollection]) => {
          setCollectionToBatch(docRef.collection(name), subCollection)
        })
      })
    }

    setCollectionToBatch(ref, collection)

    return batch.commit().then((result) => result.length)
  }

  private async deleteCollectionInBatches(
    query: FirebaseFirestore.Query,
    batchSize = 500,
    deletedCount = 0
  ): Promise<number> {
    const snapshot = await query.get()

    // No docs left to delete
    if (snapshot.size === 0) return deletedCount

    const batch = this.firestore.batch()

    const subCollectionRefs = await snapshot.docs.reduce(async (acc, doc) => {
      const prev = await acc
      // Add document deletion to batch
      batch.delete(doc.ref)

      const refs = await doc.ref.listCollections()
      return [...prev, ...refs]
    }, [] as any)

    let numDeleted = await batch.commit().then((result) => result.length)

    // Delete all subcollections
    for (const subCollectionRef of subCollectionRefs) {
      numDeleted =
        numDeleted +
        (await this.deleteCollectionInBatches(
          subCollectionRef.limit(batchSize)
        ))
    }

    if (numDeleted === 0) return deletedCount

    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve(
          this.deleteCollectionInBatches(
            query,
            batchSize,
            deletedCount + numDeleted
          )
        )
      })
    })
  }

  public async deleteCollection(collectionName: string, batchSize = 500) {
    const ref = this.firestore.collection(collectionName)
    const query = ref.limit(batchSize)
    return await this.deleteCollectionInBatches(query, batchSize)
  }

  private async execute(collectionMetadata: CollectionMetadata) {
    const { name, path } = collectionMetadata
    const { idKey, fresh } = this.options
    const { collection } = importCollectionSeed(path)

    const recordCount = collection.totalRecords()
    if (recordCount > 500) {
      throw new Error(
        `We only support up to 500 seed records per collection (including subcollections). '${name}' collection currently has ${recordCount}.`
      )
    }

    if (fresh) {
      this.emit('collection:deleteStart', name)
      const deleted = await this.deleteCollection(name)
      this.emit('collection:deleteEnd', name, { deleted })
    }

    const ref = this.firestore.collection(name)

    this.emit('collection:writeStart', name)
    const written = await this.writeCollection(ref, collection, idKey)
    this.emit('collection:writeEnd', name, { written })

    return written
  }

  private async executeAll(collectionMetadataList: CollectionMetadata[]) {
    return await Promise.all(
      collectionMetadataList.map((metadata) => this.execute(metadata))
    )
  }

  public async seed(collectionNames: string | string[]) {
    const names =
      typeof collectionNames === 'string' ? [collectionNames] : collectionNames

    const targetCollectionMetadata = names.map(
      (collectionName) => this.collectionMetadataMap[collectionName]
    )

    // Check if all metadata exists
    const notFoundIndex = targetCollectionMetadata.findIndex((data) => !data)
    if (notFoundIndex !== -1) {
      throw new Error(`Collection '${names[notFoundIndex]}' not found.`)
    }

    return await this.executeAll(targetCollectionMetadata)
  }

  public async seedAll(excludeCollectionNames: string[] = []) {
    const names = Object.keys(this.collectionMetadataMap).filter(
      (key) => !excludeCollectionNames.includes(key)
    )

    const targetCollectionMetadata = names.map(
      (collectionName) => this.collectionMetadataMap[collectionName]
    )

    return await this.executeAll(targetCollectionMetadata)
  }
}
