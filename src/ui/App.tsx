import React from 'react'
import { useErrorBoundary } from 'use-error-boundary'
import { SeedCommand } from './commands/SeedCommand'
import { Error } from './components/Error'

interface AppProps {
  command: string
  options: any
}

const App: React.FC<AppProps> = ({ command, options }) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()

  if (didCatch) {
    return <Error>{error.message}</Error>
  }

  switch (command) {
    case 'seed':
      return (
        <ErrorBoundary>
          <SeedCommand {...options} />
        </ErrorBoundary>
      )
    default:
      return <Error>Command not found.</Error>
  }
}

export default App
