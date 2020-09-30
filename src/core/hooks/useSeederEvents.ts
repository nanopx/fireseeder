import { useEffect } from 'react'
import { Seeder } from '../Seeder'

type EventHandler = (...args: any[]) => void

export const useSeederEvents = (
  seeder: Seeder,
  subscribeToEvents: string[],
  handler: (event: string, ...args: any[]) => void
) => {
  useEffect(() => {
    type Handlers = [string, EventHandler][]

    const handlers = subscribeToEvents.reduce(
      (acc, event) => [
        ...acc,
        [event, (...args: any[]) => handler(event, ...args)] as [
          string,
          EventHandler
        ],
      ],
      [] as Handlers
    )

    handlers.forEach(([event, handler]) => {
      seeder.on(event, handler)
    })

    return () => {
      handlers.forEach(([event, handler]) => {
        seeder.off(event, handler)
      })
    }
  }, [seeder, subscribeToEvents, handler])
}
