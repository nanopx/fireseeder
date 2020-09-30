import React, { Fragment, useEffect } from 'react'
import { Text } from 'ink'
import { Loading } from '@/ui/components/Loading'
import { useSeeder } from '@/core/hooks/useSeeder'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { FirestoreSeederConfig } from '@/lib/utils/collectUserConfig'
import { useLines } from '@/lib/hooks/useLines'

export type SeedCommandProps = FirestoreSeederConfig

interface Log {
  message: string
  loading: boolean
  color?: string
}

export const SeedCommand: React.FC<SeedCommandProps> = (props) => {
  const { lines, writeLine } = useLines<Log>()

  const firestore = useFirestore(props)
  const { seedAll } = useSeeder(firestore, props)

  useEffect(() => {
    seedAll()

    // writeLine('Collection', {
    //   message: 'Test',
    //   loading: true,
    //   // color: 'blue',
    // })
    // const timerId = setTimeout(() => {
    //   process.exit(0)
    // }, 2000)
    // return () => clearTimeout(timerId)
  }, [seedAll, writeLine])

  return (
    <>
      {lines.map(({ loading, message, color }, i) => (
        <Fragment key={i}>
          {loading ? (
            <Text color={color}>
              <Loading>{message}</Loading>
            </Text>
          ) : (
            <Text color={color}>{message}</Text>
          )}
        </Fragment>
      ))}
    </>
  )
}
