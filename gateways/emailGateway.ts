import { FakeEmailGateway } from '@adapters/secondary/email-gateways/FakeEmailGateway'

export const useEmailGateway = () => {
  // const { PREPARATION_STARTED_TEMPLATE_ID, SEND_EMAIL_URL } = useRuntimeConfig()
  // const emailGateway = new RealEmailGateway(
  //   SEND_EMAIL_URL,
  //   PREPARATION_STARTED_TEMPLATE_ID
  // )
  const emailGateway = new FakeEmailGateway()
  return emailGateway
}
