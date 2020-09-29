import admin from 'firebase-admin'
import { useCallback, useMemo } from 'react'
import { Seeder, SeederOptions } from '../Seeder'

export const useSeeder = (
  firestore: admin.firestore.Firestore,
  options: SeederOptions
) => {
  const seeder = useMemo(() => new Seeder(firestore, options), [
    firestore,
    options,
  ])

  const seed = useCallback(
    (collections: string | string[] = []) => {
      return seeder.seed(collections)
    },
    [seeder]
  )

  const seedAll = useCallback(() => {
    return seeder.seedAll()
  }, [seeder])

  return { seeder, seed, seedAll }
}
