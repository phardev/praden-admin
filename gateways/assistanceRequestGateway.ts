import { InMemoryTimeoutAssistanceRequestGateway } from '@adapters/secondary/assistance-request-gateways/InMemoryTimeoutAssistanceRequestGateway'
import { RealAssistanceRequestGateway } from '@adapters/secondary/assistance-request-gateways/RealAssistanceRequestGateway'
import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { RealUuidGenerator } from '@adapters/secondary/uuid-generators/RealUuidGenerator'
import type { AssistanceRequestGateway } from '@core/gateways/assistanceRequestGateway'
import { isLocalEnv } from '@utils/env'
import { assistanceAttachmentContents } from '@utils/testData/assistanceAttachmentContents'
import * as assistanceRequests from '@utils/testData/assistanceRequests'

export const useAssistanceRequestGateway = (): AssistanceRequestGateway => {
  if (isLocalEnv()) {
    return inMemory.getInstance()
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealAssistanceRequestGateway(BACKEND_URL)
}

const inMemory = (() => {
  let instance: InMemoryTimeoutAssistanceRequestGateway | undefined

  const createInstance = () => {
    const gateway = new InMemoryTimeoutAssistanceRequestGateway(
      500,
      new RealDateProvider(),
      new RealUuidGenerator()
    )
    gateway.feedWith(...Object.values(assistanceRequests))
    gateway.feedAttachmentContentsWith(assistanceAttachmentContents)
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
