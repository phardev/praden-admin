import { RealDateProvider } from '@adapters/secondary/realDateProvider'
import { InMemoryMessageGateway } from '@adapters/secondary/inMemoryMessageGateway'

export const useMessageGateway = () => {
  const messageGateway = new InMemoryMessageGateway(new RealDateProvider())
  return messageGateway
}
