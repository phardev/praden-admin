import * as ticketPredefinedAnswers from '@utils/testData/ticketPredefinedAnswers'
import { isLocalEnv } from '@utils/env'
import { useUuidGenerator } from './uuidGenerator'
import { InMemoryTicketPredefinedAnswerGateway } from '@adapters/secondary/ticket-predefined-answer-gateways/InMemoryTicketPredefinedAnswerGateway'
import { RealTicketPredefinedAnswersGateway } from '@adapters/secondary/ticket-predefined-answer-gateways/RealTicketPredefinedAnswersGateway'

export const useTicketPredefinedAnswerGateway = () => {
  if (isLocalEnv()) {
    return inMemory.getInstance()
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealTicketPredefinedAnswersGateway(BACKEND_URL)
}

const inMemory = (() => {
  let instance: any

  const createInstance = () => {
    const uuidGenerator = useUuidGenerator()
    const gateway = new InMemoryTicketPredefinedAnswerGateway(uuidGenerator)
    gateway.feedWith(...Object.values(ticketPredefinedAnswers))
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
