import React, { useEffect, useState } from 'react'
import { Config } from '@/types'
import { Loading } from '../components/Loading'
import { Text } from 'ink'

export type SeedCommandProps = Config

export const SeedCommand: React.FC<SeedCommandProps> = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const tid = setTimeout(() => {
      setLoading(false)
      process.exit(0)
    }, 2000)
    return () => clearTimeout(tid)
  }, [])

  return (
    <Text>
      {loading ? (
        <Loading>Seeding...</Loading>
      ) : (
        <Text color="green">Done.</Text>
      )}
    </Text>
  )
}
