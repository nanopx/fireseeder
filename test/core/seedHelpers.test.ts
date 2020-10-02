import { Collection } from '@/core/nodes/Collection'
import { SubCollection } from '@/core/nodes/SubCollection'
import { Document } from '@/core/nodes/Document'
import {
  collection,
  subCollection,
  document,
  ref,
  geoPoint,
  mapCollection,
  mapSubCollection,
} from '@/core/seedHelpers'
import { Ref } from '@/core/nodes/Ref'

describe('collection helper', () => {
  test('should throw if argument is not an array of Document instance', () => {
    // @ts-expect-error
    expect(() => collection({})).toThrow()

    // @ts-expect-error
    expect(() => collection('test')).toThrow()

    // @ts-expect-error
    expect(() => collection(1)).toThrow()

    // @ts-expect-error
    expect(() => collection(['a', 'b', 'c'])).toThrow()

    // Valid arguments
    expect(() => collection([])).not.toThrow()
    expect(() => collection([document({}), document({})])).not.toThrow()
  })

  test('should return an instance of Collection', () => {
    const c = collection([document({}), document({})])
    expect(c).toBeInstanceOf(Collection)
  })
})

describe('document helper', () => {
  test('should throw if argument is not an object', () => {
    // @ts-expect-error
    expect(() => document([])).toThrow()

    // @ts-expect-error
    expect(() => document('test')).toThrow()

    // @ts-expect-error
    expect(() => document(1)).toThrow()

    // Valid arguments
    expect(() => document({})).not.toThrow()
    expect(() => document({ key: 'value' })).not.toThrow()
  })

  test('should return an instance of Document', () => {
    const d = document({ key: 'value' })
    expect(d).toBeInstanceOf(Document)
  })
})

describe('subCollection helper', () => {
  test('should throw if argument is not an array of Document instance', () => {
    // @ts-expect-error
    expect(() => subCollection({})).toThrow()

    // @ts-expect-error
    expect(() => subCollection('test')).toThrow()

    // @ts-expect-error
    expect(() => subCollection(1)).toThrow()

    // @ts-expect-error
    expect(() => subCollection(['a', 'b', 'c'])).toThrow()

    // Valid arguments
    expect(() => subCollection([])).not.toThrow()
    expect(() => subCollection([document({}), document({})])).not.toThrow()
  })

  test('should return an instance of SubCollection', () => {
    const sc = subCollection([document({}), document({})])
    expect(sc).toBeInstanceOf(SubCollection)
  })
})

describe('ref helper', () => {
  test('should throw if argument is not a string', () => {
    // @ts-expect-error
    expect(() => ref({})).toThrow()

    // @ts-expect-error
    expect(() => ref([])).toThrow()

    // @ts-expect-error
    expect(() => ref(1)).toThrow()

    // Valid argument
    expect(() => ref('/doc/ref')).not.toThrow()
  })

  test('should return an instance of Ref', () => {
    const r = ref('/doc/ref')
    expect(r).toBeInstanceOf(Ref)
  })
})

describe('geoPoint helper', () => {
  test('should throw if argument is not a string', () => {
    // @ts-expect-error
    expect(() => geoPoint([])).toThrow()

    // @ts-expect-error
    expect(() => geoPoint(1)).toThrow()

    // @ts-expect-error
    expect(() => geoPoint('')).toThrow()

    // @ts-expect-error
    expect(() => geoPoint({})).toThrow()

    // @ts-expect-error
    expect(() => geoPoint({ lat: 1 })).toThrow()

    // @ts-expect-error
    expect(() => geoPoint({ lat: 'aaa', lng: 'ttt' })).toThrow()

    // Valid argument
    expect(() => geoPoint({ lat: 1, lng: 2 })).not.toThrow()
  })
})

describe('mapCollection helper', () => {
  test('should return a collection with specified number of documents', () => {
    const c = mapCollection(10, () => ({}))

    expect(c).toBeInstanceOf(Collection)

    expect(c.length).toEqual(10)

    c.forEach((d) => {
      expect(d).toBeInstanceOf(Document)
    })
  })
})

describe('mapSubCollection helper', () => {
  test('should return a subcollection with specified number of documents', () => {
    const sc = mapSubCollection(10, () => ({}))

    expect(sc).toBeInstanceOf(SubCollection)

    expect(sc.length).toEqual(10)

    sc.forEach((d) => {
      expect(d).toBeInstanceOf(Document)
    })
  })
})
