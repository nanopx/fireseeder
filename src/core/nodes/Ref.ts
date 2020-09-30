import { Node } from './Node'

export class Ref extends Node<string> {
  constructor(refPath: string) {
    super('ref', refPath)
  }
}
