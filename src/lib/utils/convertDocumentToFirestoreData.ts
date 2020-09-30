import { firestore } from 'firebase-admin'
import { Document } from '@/core/nodes/Document'
import { GeoPoint } from '@/core/nodes/GeoPoint'
import { Ref } from '@/core/nodes/Ref'

export const convertDocumentToFirestoreData = (
  db: FirebaseFirestore.Firestore,
  doc: Document
): Record<string, unknown> => {
  const keysWithoutSubCollection = doc
    .keys()
    .filter((key) => !doc.keysWithNode('subcollection').includes(key))

  return keysWithoutSubCollection.reduce((acc, key) => {
    let value = doc.values[key]

    if (value instanceof GeoPoint) {
      const { lat, lng } = value.toPlainValues()
      value = new firestore.GeoPoint(lat, lng)
    }

    if (value instanceof Ref) {
      const ref = value.toPlainValues()
      value = db.doc(ref)
    }

    return {
      ...acc,
      [key]: value,
    }
  }, {})
}
