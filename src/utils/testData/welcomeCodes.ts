import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { WelcomeCode, WelcomeCodeStatus } from '@core/entities/welcomeCode'
import { deliveryInRelayPoint } from '@utils/testData/deliveryMethods'

const DAY = 24 * 60 * 60 * 1000

export const fiveEuroWelcomeCode: WelcomeCode = {
  uuid: 'five-euro-welcome-code',
  code: '5POURVOUS',
  reductionType: ReductionType.Fixed,
  scope: PromotionScope.Products,
  amount: 500,
  conditions: { minimumAmount: 4900 },
  isActive: true,
  startDate: 1756598400000,
  endDate: 1756598400000 + 90 * DAY,
  sentCount: 200,
  usedCount: 30,
  status: WelcomeCodeStatus.Sent,
  conversionRate: 0.15
}

export const tenPercentWelcomeCode: WelcomeCode = {
  uuid: 'ten-percent-welcome-code',
  code: 'BIENVENUE10',
  reductionType: ReductionType.Percentage,
  scope: PromotionScope.Products,
  amount: 10,
  conditions: {},
  isActive: true,
  endDate: fiveEuroWelcomeCode.startDate! + 30 * DAY,
  sentCount: 1200,
  usedCount: 96,
  status: WelcomeCodeStatus.Usable,
  conversionRate: 0.08
}

export const freeRelayDeliveryWelcomeCode: WelcomeCode = {
  uuid: 'free-relay-delivery-welcome-code',
  code: 'BIENVENUE_LIVRAISON',
  reductionType: ReductionType.Percentage,
  scope: PromotionScope.Delivery,
  amount: 100,
  conditions: {
    deliveryMethodUuids: [deliveryInRelayPoint.uuid],
    maxWeight: 5000
  },
  isActive: true,
  startDate: fiveEuroWelcomeCode.endDate! + DAY,
  sentCount: 0,
  usedCount: 0,
  status: WelcomeCodeStatus.Scheduled
}

export const disabledWelcomeCode: WelcomeCode = {
  uuid: 'disabled-welcome-code',
  code: 'BIENVENUE_DESACTIVE',
  reductionType: ReductionType.Fixed,
  scope: PromotionScope.Delivery,
  amount: 250,
  conditions: {},
  isActive: false,
  sentCount: 12,
  usedCount: 1,
  status: WelcomeCodeStatus.Disabled,
  conversionRate: 1 / 12
}
