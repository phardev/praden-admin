import { InMemoryColissimoWidgetGateway } from '@adapters/secondary/colissimo-widget-gateways/InMemoryColissimoWidgetGateway'
import { RealColissimoWidgetGateway } from '@adapters/secondary/colissimo-widget-gateways/RealColissimoWidgetGateway'
import { isLocalEnv } from '@utils/env'

const colissimoWidgetGateway = new InMemoryColissimoWidgetGateway()

export const useColissimoWidgetGateway = () => {
  if (isLocalEnv()) {
    return colissimoWidgetGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealColissimoWidgetGateway(BACKEND_URL)
}
