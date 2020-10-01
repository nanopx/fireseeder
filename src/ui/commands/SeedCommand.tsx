import React, { Fragment, useCallback, useEffect, useMemo } from 'react'
import { Text } from 'ink'
import { Loading } from '@/ui/components/Loading'
import { useSeeder } from '@/core/hooks/useSeeder'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { FireseederConfig } from '@/lib/utils/collectUserConfig'
import { useLines } from '@/lib/hooks/useLines'
import { useSeederEvents } from '@/core/hooks/useSeederEvents'

export type SeedCommandProps = FireseederConfig

interface Log {
  message: string | React.ReactNode
  loading?: boolean
  color?: string
}

export const SeedCommand: React.FC<SeedCommandProps> = (props) => {
  const { lines, writeLine } = useLines<Log>()

  const firestore = useFirestore(props)
  const { seeder, seed, seedAll } = useSeeder(firestore, props)

  useSeederEvents(
    seeder,
    useMemo(
      () => [
        'collection:writeStart',
        'collection:writeEnd',
        'collection:deleteStart',
        'collection:deleteEnd',
      ],
      []
    ),
    useCallback(
      (event, collectionName, payload) => {
        switch (event) {
          case 'collection:writeStart': {
            return writeLine(`${collectionName}-write`, {
              message: (
                <>
                  Seeding <Text color="yellow">{collectionName}</Text>...
                </>
              ),
              loading: true,
            })
          }
          case 'collection:writeEnd': {
            return writeLine(`${collectionName}-write`, {
              message: (
                <Text color="green">
                  Seeding <Text color="yellow">{collectionName}</Text> has
                  finished successfully!{' '}
                  <Text color="blue">(Created {payload.written} Records)</Text>
                </Text>
              ),
              loading: false,
            })
          }
          case 'collection:deleteStart': {
            return writeLine(`${collectionName}-delete`, {
              message: (
                <Text color="red">
                  Deleting collection{' '}
                  <Text color="yellow">{collectionName}</Text>...
                </Text>
              ),
              loading: true,
            })
          }
          case 'collection:deleteEnd': {
            return writeLine(`${collectionName}-delete`, {
              message: (
                <Text color="green">
                  Collection <Text color="yellow">{collectionName}</Text> has
                  been deleted successfully!{' '}
                  <Text color="blue">(Deleted {payload.deleted} Records)</Text>
                </Text>
              ),
              loading: false,
            })
          }
          default:
            return
        }
      },
      [writeLine]
    )
  )

  useEffect(() => {
    writeLine('init', {
      message: (
        <>
          Seeding <Text color="cyan">{props.databaseUrl}</Text> with{' '}
          <Text color="yellow">
            {props.include.length === 0
              ? `all collections${
                  props.exclude.length !== 0
                    ? ` excluding ${props.exclude.join(', ')}`
                    : ''
                }`
              : props.include.join(', ')}
          </Text>
        </>
      ),
    })

    if (props.include.length === 0) {
      seedAll(props.exclude)
    } else {
      seed(props.include)
    }
  }, [seedAll, seed, writeLine, props])

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
