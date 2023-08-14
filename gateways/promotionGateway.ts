import * as promotions from '@utils/testData/promotions'
import { InMemoryPromotionGateway } from '@adapters/secondary/InMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/FakeUuidGenerator'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
promotionGateway.feedWith(...Object.values(promotions))

export const usePromotionGateway = () => {
  return promotionGateway
}
