import { useAsyncError } from '@/lib/hooks/useAsyncError'
import admin from 'firebase-admin'
import { useCallback, useMemo } from 'react'
import { Seeder, SeederOptions } from '../Seeder'

export const useSeeder = (
  firestore: admin.firestore.Firestore,
  options: SeederOptions
) => {
  const throwError = useAsyncError()

  const seeder = useMemo(() => new Seeder(firestore, options), [
    firestore,
    options,
  ])

  const seed = useCallback(
    async (collections: string | string[] = []) => {
      try {
        return await seeder.seed(collections)
      } catch (e) {
        throwError(e)
      }
    },
    [seeder, throwError]
  )

  const seedAll = useCallback(async () => {
    try {
      return await seeder.seedAll()
    } catch (e) {
      throwError(e)
    }
  }, [seeder, throwError])

  return { seeder, seed, seedAll }
}
