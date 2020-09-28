import React from 'react'
import { Text } from 'ink'

export const Error: React.FC = ({ children }) => (
  <Text>
    <Text color="white" backgroundColor="red" bold>
      {' '}
      Error{' '}
    </Text>{' '}
    {children}
  </Text>
)
