import { Collection } from './nodes/Collection'
import {
  Document,
  DocumentOptions,
  defaultDocumentOptions,
} from './nodes/Document'
import { GeoPoint, GeoPointValue } from './nodes/GeoPoint'
import { Ref } from './nodes/Ref'
import { SubCollection } from './nodes/SubCollection'

export const collection = (values: Document[]) => {
  return new Collection(values)
}

export const subCollection = (values: Document[]) => {
  return new SubCollection(values)
}

export const document = (
  values: Record<string, unknown>,
  options: DocumentOptions = { idKey: '_id' }
) => {
  return new Document(values, options)
}

export const ref = (documentPath: string) => {
  return new Ref(documentPath)
}

export const geoPoint = ({ lat, lng }: GeoPointValue) => {
  return new GeoPoint({ lat, lng })
}

export const mapCollection = (
  count: number,
  factory: (index: number) => Record<string, unknown>,
  options: DocumentOptions = defaultDocumentOptions
) => {
  return collection(
    Array.from({ length: count }).map((_, i) => document(factory(i), options))
  )
}

export const mapSubCollection = (
  count: number,
  factory: (index: number) => Record<string, unknown>,
  options: DocumentOptions = defaultDocumentOptions
) => {
  return subCollection(
    Array.from({ length: count }).map((_, i) => document(factory(i), options))
  )
}
