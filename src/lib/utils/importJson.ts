import { readFileSync } from 'fs'

export const importJsonSync = (path: string): any | never => {
  let f

  try {
    f = readFileSync(path, 'utf8')
  } catch (e) {
    throw new Error(`Could not find JSON: ${path}`)
  }

  try {
    return JSON.parse(f)
  } catch (e) {
    throw new Error(`Could not parse JSON: ${path}`)
  }
}
