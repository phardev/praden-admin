import { RealDateProvider } from '@adapters/secondary/date-providers/RealDateProvider'
import { InMemoryMessageGateway } from '@adapters/secondary/message-gateways/InMemoryMessageGateway'

export const useMessageGateway = () => {
  const messageGateway = new InMemoryMessageGateway(new RealDateProvider())
  return messageGateway
}
