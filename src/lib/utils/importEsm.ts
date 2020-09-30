// eslint-disable-next-line @typescript-eslint/no-var-requires
const requireEsm = require('esm')(module)

export const importEsmSync = (path: string) => {
  const content = requireEsm(path)
  return content.__esModule ? content : { default: content }
}
