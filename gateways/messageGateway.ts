import { RealDateProvider } from '@adapters/secondary/RealDateProvider'
import { InMemoryMessageGateway } from '@adapters/secondary/InMemoryMessageGateway'

export const useMessageGateway = () => {
  const messageGateway = new InMemoryMessageGateway(new RealDateProvider())
  return messageGateway
}
