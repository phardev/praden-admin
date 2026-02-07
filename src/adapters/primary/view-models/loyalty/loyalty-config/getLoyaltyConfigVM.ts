import { useLoyaltyStore } from '@store/loyaltyStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface MultiplierRuleVM {
  uuid: string
  multiplier: number
  startDate: number
  endDate: number
  formattedStartDate: string
  formattedEndDate: string
}

export interface GetLoyaltyConfigVM {
  pointsPerEuro: number
  multiplierRules: Array<MultiplierRuleVM>
  isLoading: boolean
}

export const getLoyaltyConfigVM = (): GetLoyaltyConfigVM | null => {
  const loyaltyStore = useLoyaltyStore()

  if (!loyaltyStore.config) return null

  return {
    pointsPerEuro: loyaltyStore.config.pointsPerEuro,
    multiplierRules: loyaltyStore.multiplierRules.map((rule) => ({
      uuid: rule.uuid,
      multiplier: rule.multiplier,
      startDate: rule.startDate,
      endDate: rule.endDate,
      formattedStartDate: timestampToLocaleString(rule.startDate, 'fr-FR'),
      formattedEndDate: timestampToLocaleString(rule.endDate, 'fr-FR')
    })),
    isLoading: loyaltyStore.isLoading
  }
}
