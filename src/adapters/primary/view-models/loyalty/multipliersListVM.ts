import type { LoyaltyPointsMultiplier } from '@core/entities/loyalty'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface MultiplierListItemVM {
  uuid: UUID
  name: string
  multiplierValue: number
  formattedMultiplierValue: string
  formattedStartDate: string
  formattedEndDate: string
  isActive: boolean
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const mapToVM = (multiplier: LoyaltyPointsMultiplier): MultiplierListItemVM => {
  return {
    uuid: multiplier.uuid,
    name: multiplier.name,
    multiplierValue: multiplier.multiplierValue,
    formattedMultiplierValue: `x${multiplier.multiplierValue}`,
    formattedStartDate: formatDate(multiplier.startDate),
    formattedEndDate: formatDate(multiplier.endDate),
    isActive: multiplier.isActive
  }
}

export const getMultipliersListVM = (): MultiplierListItemVM[] => {
  const store = useLoyaltyStore()

  const sortedMultipliers = [...store.multipliers].sort(
    (a, b) => b.startDate - a.startDate
  )

  return sortedMultipliers.map(mapToVM)
}
