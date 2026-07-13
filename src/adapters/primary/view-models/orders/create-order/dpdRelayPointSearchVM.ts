import type {
  RelayPoint,
  RelayPointOpeningSlot
} from '@core/entities/relayPoint'
import { useDpdRelayPointStore } from '@store/dpdRelayPointStore'

export interface DpdRelayPointSearchItemVM {
  id: string
  name: string
  address: string
  cityLine: string
  formattedDistance?: string
  openingHours: Array<RelayPointOpeningSlot>
}

export interface DpdRelayPointSearchVM {
  isLoading: boolean
  points: Array<DpdRelayPointSearchItemVM>
}

const toItemVM = (point: RelayPoint): DpdRelayPointSearchItemVM => {
  const item: DpdRelayPointSearchItemVM = {
    id: point.id,
    name: point.name,
    address: point.address,
    cityLine: `${point.zipCode} ${point.city}`,
    openingHours: point.openingHours ?? []
  }
  if (point.distanceInMeters !== undefined) {
    item.formattedDistance = `${point.distanceInMeters} m`
  }
  return item
}

export const dpdRelayPointSearchVM = (): DpdRelayPointSearchVM => {
  const dpdRelayPointStore = useDpdRelayPointStore()
  return {
    isLoading: dpdRelayPointStore.isLoading,
    points: dpdRelayPointStore.items.map(toItemVM)
  }
}
