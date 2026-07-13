import { InMemoryDpdPickupGateway } from '@adapters/secondary/dpd-pickup-gateways/InMemoryDpdPickupGateway'
import { RealDpdPickupGateway } from '@adapters/secondary/dpd-pickup-gateways/RealDpdPickupGateway'
import { isLocalEnv } from '@utils/env'
import * as dpdRelayPoints from '@utils/testData/dpdRelayPoints'

const dpdPickupGateway = new InMemoryDpdPickupGateway()
dpdPickupGateway.feedWith(
  dpdRelayPoints.dpdRelayPointAlesCentre,
  dpdRelayPoints.dpdRelayPointAlesNord
)

export const useDpdPickupGateway = () => {
  if (isLocalEnv()) {
    return dpdPickupGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealDpdPickupGateway(BACKEND_URL)
}
