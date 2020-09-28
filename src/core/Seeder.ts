import admin from 'firebase-admin'

export interface SeederOptions {
  seedDir: string
}

export const defaultSeederOptions: SeederOptions = {
  seedDir: './seeds',
}

export interface SeedOptions {
  includeAll: boolean
  include: string[]
}

export const defaultSeedOptions: SeedOptions = {
  includeAll: true,
  include: [],
}

export class Seeder {
  constructor(
    private firestore: admin.firestore.Firestore,
    private options: SeederOptions = defaultSeederOptions
  ) {}

  public seed({ includeAll, include }: SeedOptions = defaultSeedOptions) {
    const { seedDir } = this.options
    console.log(seedDir, includeAll, include)
  }
}
