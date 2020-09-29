import React from 'react'
import { Text } from 'ink'

export const Error: React.FC = ({ children }) => (
  <Text bold>
    <Text color="white" backgroundColor="red">
      {' '}
      Error{' '}
    </Text>{' '}
    {children}
  </Text>
)
