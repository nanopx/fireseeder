import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { useMemo } from 'react'

export interface FirebaseOptions {
  databaseUrl: string
  credential: string
}

export const useFirestore = (options: FirebaseOptions) => {
  const firestore = useMemo(() => {
    let credential
    try {
      const f = readFileSync(options.credential, 'utf8')
      credential = JSON.parse(f)
    } catch (e) {
      // TODO: Handle error
    }

    admin.initializeApp({
      databaseURL: options.databaseUrl,
      credential: admin.credential.cert(credential),
    })
    return admin.firestore()
  }, [options])

  return firestore
}
