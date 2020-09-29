import admin from 'firebase-admin'
import { useCallback, useMemo } from 'react'
import { Seeder, SeederOptions, SeedOptions } from '../Seeder'

export const useSeeder = (
  firestore: admin.firestore.Firestore,
  options: SeederOptions & SeedOptions
) => {
  const seeder = useMemo(() => new Seeder(firestore, options), [
    firestore,
    options,
  ])

  const seed = useCallback(
    (seedOptions: Partial<SeedOptions> = {}) => {
      return seeder.seed({ ...options, ...seedOptions })
    },
    [seeder, options]
  )

  return { seed, seeder }
}