import React from 'react'
import { Text } from 'ink'
import Spinner from 'ink-spinner'

export const Loading: React.FC = ({ children = 'Loading...' }) => (
  <>
    <Text color="green">
      <Spinner type="dots" />
    </Text>{' '}
    {children}
  </>
)
