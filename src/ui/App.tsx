import React from 'react'
import { SeedCommand } from './commands/SeedCommand'
import { Error } from './components/Error'

interface AppProps {
  command: 'seed' // | 'generate'
  options: any
}

const App: React.FC<AppProps> = ({ command, options }) => {
  switch (command) {
    case 'seed':
      return <SeedCommand {...options} />
    default:
      return <Error>Command not found.</Error>
  }
}

export default App
