import * as promotions from '@utils/testData/promotions'
import { InMemoryPromotionGateway } from '@core/usecases/promotions/promotions-listing/inMemoryPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/fakeUuidGenerator'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
promotionGateway.feedWith(...Object.values(promotions))

export const usePromotionGateway = () => {
  return promotionGateway
}
