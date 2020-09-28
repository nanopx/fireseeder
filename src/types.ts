import { SeederOptions, SeedOptions } from './core/Seeder'
import { FirebaseOptions } from './utils/useFirestore'

export type Config = FirebaseOptions & SeederOptions & SeedOptions
export type EnvConfig = FirebaseOptions & SeederOptions
