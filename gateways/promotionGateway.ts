import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import * as promotions from '@utils/testData/promotions'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
promotionGateway.feedWith(...Object.values(promotions))

export const usePromotionGateway = () => {
  return promotionGateway
  // const { BACKEND_URL } = useRuntimeConfig().public
  // return new RealPromotionGateway(BACKEND_URL)
}
