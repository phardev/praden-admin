import { FakeEmailGateway } from '@adapters/secondary/fakeEmailGateway'

export const useEmailGateway = () => {
  const emailGateway = new FakeEmailGateway()
  return emailGateway
}
