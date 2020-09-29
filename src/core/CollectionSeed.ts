import { importEsmSync } from '@/lib/utils/importEsm'
import { basename, extname } from 'path'

export interface CollectionSeedOptions {
  idKey: string
}

export const defaultCollectionSeedOption: CollectionSeedOptions = {
  idKey: '_id',
}

export class CollectionSeed {
  public name: string
  private seedData: any[]

  /**
   * Collection constructor
   * @param seedFilePath  Absolute path to seed file
   * @param options       Options
   */
  constructor(
    seedFilePath: string,
    private options: CollectionSeedOptions = defaultCollectionSeedOption
  ) {
    this.name = basename(seedFilePath, extname(seedFilePath))

    const data = importEsmSync(seedFilePath)

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
}
