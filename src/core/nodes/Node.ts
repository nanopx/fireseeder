export type NodeType =
  | 'collection'
  | 'document'
  | 'subcollection'
  | 'ref'
  | 'geopoint'

export abstract class Node<T = any | any[]> {
  constructor(private __type: NodeType, private __values: T) {}

  get type(): NodeType {
    return this.__type
  }

  get values(): T {
    return this.__values
  }

  toPlainValues(): T {
    if (this.values instanceof Node) {
      return this.values.toPlainValues()
    }

    if (Array.isArray(this.values)) {
      return (this.values.map((value) => {
        return value instanceof Node ? value.toPlainValues() : value
      }) as unknown) as T
    }

    if (typeof this.values === 'object') {
      return Object.keys(this.values).reduce((acc, key) => {
        const value = (this.values as any)[key]
        return {
          ...acc,
          [key]: value instanceof Node ? value.toPlainValues() : value,
        }
      }, {} as T)
    }

    return this.values
  }
}
