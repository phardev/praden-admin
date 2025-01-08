import { ReductionType } from '@core/entities/promotion'
import {
  PromotionCode,
  PromotionScope
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { deliveryInRelayPoint } from '@utils/testData/deliveryMethods'

export const newSitePromotionCode: PromotionCode = {
  uuid: 'new-site-promotion-code',
  code: 'NEW SITE',
  currentUses: 0,
  reductionType: ReductionType.Percentage,
  scope: PromotionScope.Products,
  amount: 10,
  conditions: {}
}

export const fifteenPercentPromotionCode: PromotionCode = {
  uuid: 'percent-promotion-code',
  code: 'PERCENT',
  currentUses: 0,
  reductionType: ReductionType.Percentage,
  scope: PromotionScope.Products,
  amount: 15,
  conditions: {}
}

export const fifteenPercentIfMiniumAmountPromotionCode: PromotionCode = {
  uuid: 'percent-with-minimum-amount-promotion-code',
  code: 'AT_LEAST_20_FOR_15_PERCENT',
  currentUses: 20,
  reductionType: ReductionType.Percentage,
  scope: PromotionScope.Products,
  amount: 15,
  conditions: {
    minimumAmount: 2000
  }
}

export const tenEuroFixedPromotionCode: PromotionCode = {
  uuid: 'fixed-promotion-code',
  code: 'FIXED',
  currentUses: 10,
  reductionType: ReductionType.Fixed,
  scope: PromotionScope.Products,
  amount: 1000,
  conditions: {}
}

export const limitedInTimePromotionCode: PromotionCode = {
  uuid: 'limited-in-time-promotion-code',
  code: 'LIMITED_IN_TIME',
  currentUses: 0,
  reductionType: ReductionType.Fixed,
  scope: PromotionScope.Products,
  amount: 1000,
  conditions: {},
  startDate: 1736341421000,
  endDate: 1736381421000
}

export const limitedPromotionCode: PromotionCode = {
  uuid: 'limited-promotion-code',
  code: 'LIMITED',
  currentUses: 0,
  reductionType: ReductionType.Fixed,
  scope: PromotionScope.Products,
  amount: 1000,
  conditions: {
    maximumUsage: 200
  }
}

export const deliveryPromotionCode: PromotionCode = {
  uuid: 'delivery-promotion-code',
  code: 'FREE_DELIVERY',
  currentUses: 0,
  reductionType: ReductionType.Percentage,
  scope: PromotionScope.Delivery,
  amount: 100,
  conditions: {
    deliveryMethodUuid: deliveryInRelayPoint.uuid
  }
}
