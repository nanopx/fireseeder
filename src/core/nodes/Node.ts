export type NodeType =
  | 'collection'
  | 'document'
  | 'subcollection'
  | 'ref'
  | 'geopoint'

export abstract class Node<T = any> {
  constructor(private __type: NodeType, private __values: T) {}

  get type(): NodeType {
    return this.__type
  }

  get values(): T {
    return this.__values
  }

  toObject(): T | T[] {
    if (this.values instanceof Node) {
      return this.values.toObject()
    }

    if (Array.isArray(this.values)) {
      return this.values.map((value) => {
        return value instanceof Node ? value.toObject() : value
      })
    }

    if (typeof this.values === 'object') {
      return Object.keys(this.values).reduce((acc, key) => {
        const value = (this.values as any)[key]
        return {
          ...acc,
          [key]: value instanceof Node ? value.toObject() : value,
        }
      }, {} as T)
    }

    return this.values
  }
}
