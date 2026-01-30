import { useLoyaltySettingsStore } from '@store/loyaltySettingsStore'

export interface LoyaltySettingsVM {
  pointsRatio: number
  formattedRatio: string
  isLoading: boolean
  hasSettings: boolean
  settingsUuid?: string
}

const formatRatio = (ratio: number): string => {
  if (ratio === 0) {
    return ''
  }
  const eurosPerPoint = Math.round(1 / ratio)
  return `1 point pour ${eurosPerPoint}€`
}

export const loyaltySettingsVM = (): LoyaltySettingsVM => {
  const loyaltySettingsStore = useLoyaltySettingsStore()
  const settings = loyaltySettingsStore.settings

  return {
    pointsRatio: settings?.pointsRatio ?? 0,
    formattedRatio: settings ? formatRatio(settings.pointsRatio) : '',
    isLoading: loyaltySettingsStore.isLoading,
    hasSettings: settings !== null,
    settingsUuid: settings?.uuid
  }
}
