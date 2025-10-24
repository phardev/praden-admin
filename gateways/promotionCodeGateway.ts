import { InMemoryPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/InMemoryPromotionCodeGateway'
import { RealPromotionCodeGateway } from '@adapters/secondary/promotion-code-gateways/RealPromotionCodeGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as promotionCodes from '@utils/testData/promotionCodes'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionCodeGateway = new InMemoryPromotionCodeGateway(uuidGenerator)
promotionCodeGateway.feedWith(...Object.values(promotionCodes))

export const usePromotionCodeGateway = () => {
  if (isLocalEnv()) {
    return promotionCodeGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealPromotionCodeGateway(BACKEND_URL)
}
