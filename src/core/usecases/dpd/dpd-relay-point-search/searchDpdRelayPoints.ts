import { RelayPointSearchParams } from '@core/entities/relayPoint'
import { DpdPickupGateway } from '@core/gateways/dpdPickupGateway'
import { useDpdRelayPointStore } from '@store/dpdRelayPointStore'

export const searchDpdRelayPoints = async (
  params: RelayPointSearchParams,
  dpdPickupGateway: DpdPickupGateway
) => {
  const dpdRelayPointStore = useDpdRelayPointStore()
  try {
    dpdRelayPointStore.startLoading()
    const points = await dpdPickupGateway.search(params)
    dpdRelayPointStore.list(points)
  } finally {
    dpdRelayPointStore.stopLoading()
  }
}
