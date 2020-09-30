import { Document } from './Document'
import { Node } from './Node'

export class SubCollection extends Node<Document[]> {
  constructor(subCollection: Document[]) {
    super('subcollection', subCollection)
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
