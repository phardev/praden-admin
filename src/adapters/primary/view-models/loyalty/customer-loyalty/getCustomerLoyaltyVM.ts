import type {
  PointsTransaction,
  PointsTransactionType
} from '@core/entities/loyalty/pointsTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface TransactionVM {
  uuid: string
  type: PointsTransactionType
  typeLabel: string
  points: string
  description: string
  formattedDate: string
}

export interface GetCustomerLoyaltyVM {
  pointsBalance: number
  transactions: Array<TransactionVM>
  hasTransactions: boolean
  isLoading: boolean
}

const TYPE_LABEL_MAP: Record<PointsTransactionType, string> = {
  EARNED: 'loyalty.customer.earned',
  EXPIRED: 'loyalty.customer.expired',
  MANUAL_CREDIT: 'loyalty.customer.manualCredit'
}

const formatPoints = (points: number): string => {
  return points >= 0 ? `+${points}` : `${points}`
}

const mapTransactionToVM = (transaction: PointsTransaction): TransactionVM => ({
  uuid: transaction.uuid,
  type: transaction.type,
  typeLabel: TYPE_LABEL_MAP[transaction.type],
  points: formatPoints(transaction.points),
  description: transaction.description || '',
  formattedDate: timestampToLocaleString(
    new Date(transaction.createdAt).getTime(),
    'fr-FR'
  )
})

export const getCustomerLoyaltyVM = (): GetCustomerLoyaltyVM | null => {
  const loyaltyStore = useLoyaltyStore()

  if (!loyaltyStore.customerLoyalty) return null

  const transactions =
    loyaltyStore.customerLoyalty.transactions.map(mapTransactionToVM)

  return {
    pointsBalance: loyaltyStore.customerLoyalty.pointsBalance,
    transactions,
    hasTransactions: transactions.length > 0,
    isLoading: loyaltyStore.isLoading
  }
}
