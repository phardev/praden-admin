import { InMemoryPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'
import { RealPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/RealPromotionCodeGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as promotionCodeStats from '@utils/testData/promotionCodeStats'
import * as promotionCodes from '@utils/testData/promotionCodes'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionCodeGateway = new InMemoryPromotionCodeGateway(uuidGenerator)
promotionCodeGateway.feedWith(...Object.values(promotionCodes))
promotionCodeGateway.feedStatsFor(
  promotionCodes.newSitePromotionCode.code,
  promotionCodeStats.newSitePromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.fifteenPercentPromotionCode.code,
  promotionCodeStats.fifteenPercentPromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.fifteenPercentIfMiniumAmountPromotionCode.code,
  promotionCodeStats.fifteenPercentIfMiniumAmountPromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.tenEuroFixedPromotionCode.code,
  promotionCodeStats.tenEuroFixedPromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.limitedInTimePromotionCode.code,
  promotionCodeStats.limitedInTimePromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.limitedPromotionCode.code,
  promotionCodeStats.limitedPromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.deliveryPromotionCode.code,
  promotionCodeStats.deliveryPromotionCodeStats
)
promotionCodeGateway.feedStatsFor(
  promotionCodes.productRestrictedPromotionCode.code,
  promotionCodeStats.productRestrictedPromotionCodeStats
)

export const usePromotionCodeGateway = () => {
  if (isLocalEnv()) {
    return promotionCodeGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealPromotionCodeGateway(BACKEND_URL)
}
