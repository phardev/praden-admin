import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { timestampToLocaleString } from '@utils/formatters'

const MultiplierStatus = {
  Active: 'active',
  Expired: 'expired',
  Upcoming: 'upcoming'
} as const
type MultiplierStatus = (typeof MultiplierStatus)[keyof typeof MultiplierStatus]

export interface MultiplierItemVM {
  uuid: UUID
  startDate: string
  endDate: string
  multiplier: string
  status: MultiplierStatus
}

export interface LoyaltyConfigVM {
  earningRate: number
  multipliers: Array<MultiplierItemVM>
  isLoading: boolean
}

const formatDate = (timestamp: number): string => {
  return timestampToLocaleString(timestamp, 'fr-FR')
}

const formatMultiplier = (value: number): string => {
  return `x${value}`
}

const computeStatus = (
  startDate: number,
  endDate: number
): MultiplierStatus => {
  const now = Date.now()
  if (now < startDate) return MultiplierStatus.Upcoming
  if (now > endDate) return MultiplierStatus.Expired
  return MultiplierStatus.Active
}

export const earningRateToForm = (
  earningRate: number
): { points: number; euros: number } => {
  const euros = Math.round(1 / (earningRate * 100))
  return { points: 1, euros: Math.max(euros, 1) }
}

export const formToEarningRate = (points: number, euros: number): number => {
  return points / (euros * 100)
}

export const previewPoints = (
  orderEuros: number,
  earningRate: number
): number => {
  const amountCents = Math.round(orderEuros * 100)
  return Math.floor(amountCents * earningRate)
}

export const loyaltyConfigVM = (): LoyaltyConfigVM => {
  const loyaltyStore = useLoyaltyStore()
  const config = loyaltyStore.config

  if (!config) {
    return {
      earningRate: 0,
      multipliers: [],
      isLoading: loyaltyStore.isLoading
    }
  }

  return {
    earningRate: config.earningRate,
    multipliers: (config.multipliers ?? []).map((m) => ({
      uuid: m.uuid,
      startDate: formatDate(m.startDate),
      endDate: formatDate(m.endDate),
      multiplier: formatMultiplier(m.multiplier),
      status: computeStatus(m.startDate, m.endDate)
    })),
    isLoading: loyaltyStore.isLoading
  }
}
