import { usePreparationStore } from '@store/preparationStore'
import { Order } from '@core/entities/order'
import { DateProvider } from '@core/gateways/dateProvider'
import {
  waitingClientAnswerFilter,
  waitingReplenishmentFilter
} from '../get-waiting-preparations/getWaitingPreparationsVM'

export enum GaugeStatus {
  Good = 'GOOD',
  Warning = 'WARNING',
  Alert = 'ALERT'
}

export interface PreparationsGaugeVM {
  status: GaugeStatus
  percentage: number
  totalCount: number
  goodCount: number
  warningCount: number
  alertCount: number
}

const isWaitingState = (order: Order): boolean => {
  return waitingClientAnswerFilter(order) || waitingReplenishmentFilter(order)
}

const calculateHoursSinceCreation = (
  createdAt: number,
  dateProvider: DateProvider
): number => {
  const now = dateProvider.now()
  const diffMs = now - createdAt
  return diffMs / (1000 * 60 * 60)
}

const getOrderStatus = (
  order: Order,
  dateProvider: DateProvider
): GaugeStatus => {
  const hoursSinceCreation = calculateHoursSinceCreation(
    order.createdAt,
    dateProvider
  )

  if (hoursSinceCreation <= 36) {
    return GaugeStatus.Good
  } else if (hoursSinceCreation <= 48) {
    return GaugeStatus.Warning
  } else {
    return GaugeStatus.Alert
  }
}

export const getPreparationsGaugeVM = (
  dateProvider: DateProvider
): PreparationsGaugeVM => {
  const preparationStore = usePreparationStore()
  const orders = preparationStore.items.filter((order) => {
    return !isWaitingState(order) && order.deliveries.length > 0
  })

  const statusCounts = {
    [GaugeStatus.Good]: 0,
    [GaugeStatus.Warning]: 0,
    [GaugeStatus.Alert]: 0
  }

  orders.forEach((order) => {
    const status = getOrderStatus(order, dateProvider)
    statusCounts[status]++
  })

  const totalCount = orders.length
  const alertCount = statusCounts[GaugeStatus.Alert]
  const warningCount = statusCounts[GaugeStatus.Warning]
  const goodCount = statusCounts[GaugeStatus.Good]

  let status = GaugeStatus.Good
  if (alertCount > 0) {
    status = GaugeStatus.Alert
  } else if (warningCount > 0) {
    status = GaugeStatus.Warning
  }

  let percentage = 100
  if (totalCount > 0) {
    const score = (goodCount * 100 + warningCount * 50) / totalCount
    percentage = Math.round(score)
  }

  return {
    status,
    percentage,
    totalCount,
    goodCount,
    warningCount,
    alertCount
  }
}
