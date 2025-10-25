import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { RealPromotionGateway } from '@adapters/secondary/promotion-gateways/RealPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as promotionsListItems from '@utils/testData/fixtures/promotions/promotionListItems'
import * as promotions from '@utils/testData/promotions'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
promotionGateway.feedWith(...Object.values(promotions))
promotionGateway.feedListItemWith(...Object.values(promotionsListItems))

export const usePromotionGateway = () => {
  if (isLocalEnv()) {
    return promotionGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealPromotionGateway(BACKEND_URL)
}
