import { Document } from './Document'
import { Node } from './Node'

export class Collection extends Node<Document[]> {
  constructor(collection: Document[]) {
    super('collection', collection)
  }

  map(callback: (doc: Document) => void) {
    return this.values.map(callback)
  }

  forEach(callback: (doc: Document) => void) {
    this.values.forEach(callback)
  }

  get length(): number {
    return this.values.length
  }

  totalRecords(): number {
    return this.values.reduce(
      (acc, doc) => acc + doc.totalRecords(),
      this.length
    )
  }
}
