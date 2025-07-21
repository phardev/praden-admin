import * as tickets from '@utils/testData/tickets'
import { isLocalEnv } from '@utils/env'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { InMemoryTimeoutTicketGateway } from '@adapters/secondary/ticket-gateways/InMemoryTimeoutTicketGateway'

export const useTicketGateway = () => {
  if (isLocalEnv()) {
    return inMemory.getInstance()
  }
  throw new Error('Real ticket gateway not implemented')
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
