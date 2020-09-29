import * as admin from 'firebase-admin'

export function getAdmin(
  databaseURL: string,
  credential: admin.ServiceAccount
): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App
  }

  const app = admin.initializeApp({
    databaseURL,
    credential: admin.credential.cert(credential),
  })

  return app
}
