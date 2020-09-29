import { useMemo } from 'react'
import { getAdmin } from '../utils/firebaseAdmin'
import { getUserPath } from '../utils/getUserPath'
import { importJsonSync } from '../utils/importJson'

export interface FirebaseOptions {
  databaseUrl: string
  credential: string
}

export const useFirestore = (options: FirebaseOptions) => {
  const firestore = useMemo(() => {
    const credentialObj = importJsonSync(getUserPath(options.credential))

    const admin = getAdmin(options.databaseUrl, credentialObj)

    return admin.firestore()
  }, [options])

  return firestore
}
