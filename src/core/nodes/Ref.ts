import { Node } from './Node'

export class Ref extends Node<string> {
  constructor(refPath: string) {
    super('ref', refPath)

    if (typeof refPath !== 'string') {
      throw new Error('Invalid reference path passed to Ref.')
    }
  }
}
