import { useCallback, useMemo, useState } from 'react'

export const useLines = <T = Record<string, unknown>>() => {
  const [linesMap, setLines] = useState<{ [key: string]: T }>({})

  const writeLine = useCallback((id: string, line: T) => {
    setLines((lines) => ({
      ...lines,
      [id]: { ...(lines[id] ? lines[id] : {}), ...line },
    }))
  }, [])

  const removeLine = useCallback((id: string) => {
    setLines(({ [id]: _, ...rest }) => rest)
  }, [])

  const lines = useMemo(() => Object.keys(linesMap).map((k) => linesMap[k]), [
    linesMap,
  ])

  return { lines, writeLine, removeLine }
}
