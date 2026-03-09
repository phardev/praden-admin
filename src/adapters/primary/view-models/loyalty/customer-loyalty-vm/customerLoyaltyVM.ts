import type { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface CustomerLoyaltyItemVM {
  uuid: string
  date: string
  type: LoyaltyTransactionType
  points: number
  orderUuid?: UUID
  reason?: string
  expiresAt: string
  isExpired: boolean
}

export interface CustomerLoyaltyVM {
  balance: number
  transactions: Array<CustomerLoyaltyItemVM>
  isLoading: boolean
}

const formatDate = (timestamp: number): string => {
  return timestampToLocaleString(timestamp, 'fr-FR')
}

const isExpired = (expiresAt: number): boolean => {
  return expiresAt < Date.now()
}

export const customerLoyaltyVM = (): CustomerLoyaltyVM => {
  const loyaltyStore = useLoyaltyStore()
  const customerLoyalty = loyaltyStore.customerLoyalty

  if (!customerLoyalty) {
    return {
      balance: 0,
      transactions: [],
      isLoading: loyaltyStore.isLoading
    }
  }

  return {
    balance: customerLoyalty.balance,
    transactions: customerLoyalty.transactions.map((tx) => ({
      uuid: tx.uuid,
      date: formatDate(tx.earnedAt),
      type: tx.type,
      points: tx.points,
      orderUuid: tx.orderUuid,
      reason: tx.reason,
      expiresAt: formatDate(tx.expiresAt),
      isExpired: isExpired(tx.expiresAt)
    })),
    isLoading: loyaltyStore.isLoading
  }
}
