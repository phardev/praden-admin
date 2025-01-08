import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import * as promotionCodes from '@utils/testData/promotionCodes'
import { isLocalEnv } from '@utils/env'
import { InMemoryPromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/InMemoryPromotionCodeGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionCodeGateway = new InMemoryPromotionCodeGateway()
promotionCodeGateway.feedWith(...Object.values(promotionCodes))

export const usePromotionCodeGateway = () => {
  if (isLocalEnv()) {
    return promotionCodeGateway
  }
  return promotionCodeGateway
  // const { BACKEND_URL } = useRuntimeConfig().public
  // return new RealPromotionGateway(BACKEND_URL)
}
