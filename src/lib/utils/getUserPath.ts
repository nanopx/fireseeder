import { resolve as pathResolve } from 'path'

export const getUserPath = (...path: string[]): string => {
  return pathResolve(process.cwd(), ...path)
}
