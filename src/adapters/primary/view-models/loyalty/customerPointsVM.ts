import type {
  LoyaltyPointsTransaction,
  LoyaltyTransactionType
} from '@core/entities/loyalty'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface CustomerPointsTransactionVM {
  uuid: UUID
  type: LoyaltyTransactionType
  points: number
  orderUuid?: UUID
  reason?: string
  creditedBy?: string
  formattedCreatedAt: string
  formattedExpiresAt: string | null
}

export interface CustomerPointsVM {
  balance: number
  transactions: CustomerPointsTransactionVM[]
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const mapTransaction = (
  transaction: LoyaltyPointsTransaction
): CustomerPointsTransactionVM => {
  return {
    uuid: transaction.uuid,
    type: transaction.type,
    points: transaction.points,
    orderUuid: transaction.orderUuid,
    reason: transaction.reason,
    creditedBy: transaction.creditedBy,
    formattedCreatedAt: formatDate(transaction.createdAt),
    formattedExpiresAt: transaction.expiresAt
      ? formatDate(transaction.expiresAt)
      : null
  }
}

export const getCustomerPointsVM = (
  customerUuid: UUID
): CustomerPointsVM | null => {
  const store = useLoyaltyStore()
  const customerPoints = store.customerPoints.get(customerUuid)

  if (!customerPoints) {
    return null
  }

  const sortedTransactions = [...customerPoints.transactions].sort(
    (a, b) => b.createdAt - a.createdAt
  )

  return {
    balance: customerPoints.balance,
    transactions: sortedTransactions.map(mapTransaction)
  }
}
