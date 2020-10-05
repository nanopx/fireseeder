import * as admin from 'firebase-admin'
import { document, geoPoint, ref, subCollection } from '@/core/seedHelpers'
import { convertDocumentToFirestoreData } from '@/lib/utils/convertDocumentToFirestoreData'

admin.initializeApp()
const firestore = admin.firestore()

test('should be able to exclude document keys', () => {
  const data = convertDocumentToFirestoreData(
    firestore,
    document({
      key: 'value',
      key2: 'value2',
    }),
    ['key']
  )

  expect(data.key).toBeUndefined()
  expect(data.key2).toEqual('value2')
})

test('should be able to convert document to valid firestore data', () => {
  const data = convertDocumentToFirestoreData(
    firestore,
    document(
      {
        _id: 'ID',
        string: 'value',
        number: 1,
        ref: ref('/foo/bar'),
        geoPoint: geoPoint({ lat: 0.111, lng: 0.222 }),
        subCollection: subCollection([]),
      },
      { idKey: '_id' }
    ),
    ['_id']
  )

  expect(data._id).toBeUndefined()
  expect(data.string).toEqual('value')
  expect(data.number).toEqual(1)
  expect(data.ref).toEqual(firestore.doc('/foo/bar'))
  expect(data.geoPoint).toBeInstanceOf(admin.firestore.GeoPoint)
  expect(data.subCollection).toBeUndefined()
})
