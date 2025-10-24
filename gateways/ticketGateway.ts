import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { InMemoryTimeoutTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTimeoutTicketGateway'
import { RealTicketGateway } from '@adapters/secondary/ticket-gateways/RealTicketGateway'
import { isLocalEnv } from '@utils/env'
import * as tickets from '@utils/testData/tickets'

export const useTicketGateway = () => {
  if (isLocalEnv()) {
    return inMemory.getInstance()
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealTicketGateway(BACKEND_URL)
}

const inMemory = (() => {
  let instance: any

  const createInstance = () => {
    const gateway = new InMemoryTimeoutTicketGateway(
      500,
      new RealDateProvider()
    )
    gateway.feedWith(...Object.values(tickets))
    return gateway
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
