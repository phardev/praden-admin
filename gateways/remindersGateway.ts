import { RemindersGateway } from '@core/gateways/remindersGateway'
import { RealRemindersGateway } from '@adapters/secondary/reminders-gateways/RealRemindersGateway'
import { InMemoryRemindersGateway } from '@adapters/secondary/reminders-gateways/InMemoryRemindersGateway'
import { isLocalEnv } from '@utils/env'

const inMemory = (() => {
  let instance: InMemoryRemindersGateway | null = null

  const createInstance = () => {
    return new InMemoryRemindersGateway()
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    }
  }
})()

export const useRemindersGateway = (): RemindersGateway => {
  if (isLocalEnv()) {
    return inMemory.getInstance()
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealRemindersGateway(BACKEND_URL)
}
