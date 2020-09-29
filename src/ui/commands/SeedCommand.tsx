import React, { useEffect, useState } from 'react'
import { Text } from 'ink'
import { Loading } from '@/ui/components/Loading'
import { SeedOptions } from '@/core/Seeder'
import { useSeeder } from '@/core/hooks/useSeeder'
import { useFirestore } from '@/lib/hooks/useFirestore'
import { FirestoreSeederConfig } from '@/lib/utils/collectUserConfig'

export type SeedCommandProps = FirestoreSeederConfig & SeedOptions

export const SeedCommand: React.FC<SeedCommandProps> = (props) => {
  const [loading, setLoading] = useState(true)

  const firestore = useFirestore(props)
  const { seed } = useSeeder(firestore, props)

  useEffect(() => {
    seed()
    // const timerId = setTimeout(() => {
    //   setLoading(false)
    //   process.exit(0)
    // }, 2000)
    // return () => clearTimeout(timerId)
  }, [seed])

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
