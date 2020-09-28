import admin from 'firebase-admin'
import { useCallback, useMemo } from 'react'
import { Seeder, SeederOptions, SeedOptions } from './Seeder'

export const useSeeder = (
  firestore: admin.firestore.Firestore,
  options: SeederOptions & SeedOptions
) => {
  const seeder = useMemo(() => new Seeder(firestore, options), [
    firestore,
    options,
  ])

  const seed = useCallback(
    (seedOptions: SeedOptions) => {
      return seeder.seed(seedOptions)
    },
    [seeder]
  )

  return { seed, seeder }
}
