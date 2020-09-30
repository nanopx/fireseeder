import { Node, NodeType } from './Node'
import { SubCollection } from './SubCollection'

export interface DocumentOptions {
  idKey?: string | null
}

export const defaultDocumentOptions: DocumentOptions = {
  idKey: null,
}

export class Document extends Node<Record<string, unknown>> {
  constructor(
    doc: Record<string, unknown>,
    private options: DocumentOptions = defaultDocumentOptions
  ) {
    super('document', doc)
  }

  get idKey(): string | null | undefined {
    return this.options.idKey
  }

  getId(idKey: string): string | undefined {
    const id = this.values[this.idKey || idKey]
    return id ? `${id}` : undefined
  }

  keys(): string[] {
    return Object.keys(this.values)
  }

  getSubCollectionEntries(): [string, SubCollection][] {
    return this.keysWithNode('subcollection').map((key) => [
      key,
      this.values[key] as SubCollection,
    ])
  }

  keysWithNode(nodeType?: NodeType): string[] {
    return this.keys().filter((key) => {
      const value = this.values[key]
      return value instanceof Node && (!nodeType || value.type === nodeType)
    })
  }

  totalRecords() {
    return this.keysWithNode('subcollection').reduce((acc, key) => {
      const subCollection = this.values[key] as SubCollection
      return acc + subCollection.totalRecords()
    }, 0)
  }
}
