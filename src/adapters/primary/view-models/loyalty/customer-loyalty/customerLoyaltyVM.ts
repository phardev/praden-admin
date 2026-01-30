import type { LoyaltyTransaction } from '@core/entities/loyalty'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface CustomerLoyaltyItemVM {
  uuid: string
  orderUuid: string
  orderLink: string
  points: number
  pointsFormatted: string
  earnedAt: string
  expiresAt: string
  isExpired: boolean
}

export interface CustomerLoyaltyVM {
  balance: number
  balanceFormatted: string
  totalEarned: number
  totalEarnedFormatted: string
  transactions: Array<CustomerLoyaltyItemVM>
  hasHistory: boolean
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatPoints = (points: number): string => {
  return `${points} points`
}

const mapTransaction = (
  transaction: LoyaltyTransaction
): CustomerLoyaltyItemVM => ({
  uuid: transaction.uuid,
  orderUuid: transaction.orderUuid,
  orderLink: `/orders/${transaction.orderUuid}`,
  points: transaction.points,
  pointsFormatted: formatPoints(transaction.points),
  earnedAt: formatDate(transaction.earnedAt),
  expiresAt: formatDate(transaction.expiresAt),
  isExpired: transaction.isExpired
})

export const customerLoyaltyVM = (customerUuid: string): CustomerLoyaltyVM => {
  const loyaltyStore = useLoyaltyStore()
  const loyalty = loyaltyStore.customerLoyalty.get(customerUuid)

  const balance = loyalty?.balance ?? 0
  const totalEarned = loyalty?.totalEarned ?? 0
  const transactions = loyalty?.transactions ?? []

  return {
    balance,
    balanceFormatted: formatPoints(balance),
    totalEarned,
    totalEarnedFormatted: formatPoints(totalEarned),
    transactions: transactions.map(mapTransaction),
    hasHistory: transactions.length > 0
  }
}
