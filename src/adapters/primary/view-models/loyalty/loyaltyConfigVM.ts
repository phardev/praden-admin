import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface MultiplierItemVM {
  uuid: string
  startDate: string
  endDate: string
  multiplier: number
  createdAt: string
}

export interface LoyaltyConfigVM {
  pointsPerEuro: number | null
  multipliers: Array<MultiplierItemVM>
  isLoading: boolean
}

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

const toMultiplierItemVM = (
  multiplier: LoyaltyPointsMultiplier
): MultiplierItemVM => ({
  uuid: multiplier.uuid,
  startDate: formatDate(multiplier.startDate),
  endDate: formatDate(multiplier.endDate),
  multiplier: multiplier.multiplier,
  createdAt: formatDate(multiplier.createdAt)
})

export const getLoyaltyConfigVM = (): LoyaltyConfigVM => {
  const loyaltyStore = useLoyaltyStore()

  return {
    pointsPerEuro: loyaltyStore.config?.pointsPerEuro ?? null,
    multipliers: loyaltyStore.multipliers.map(toMultiplierItemVM),
    isLoading: loyaltyStore.isLoading
  }
}
