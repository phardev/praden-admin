import { FakeEmailGateway } from '@adapters/secondary/email-gateways/FakeEmailGateway'
import { RealEmailGateway } from '@adapters/secondary/email-gateways/RealEmailGateway'
import { isLocalEnv } from '@utils/env'

export const useEmailGateway = () => {
  if (isLocalEnv()) {
    const emailGateway = new FakeEmailGateway()
    return emailGateway
  }
  const { PREPARATION_STARTED_TEMPLATE_ID, SEND_EMAIL_URL } = useRuntimeConfig()
  return new RealEmailGateway(SEND_EMAIL_URL, PREPARATION_STARTED_TEMPLATE_ID)
}
