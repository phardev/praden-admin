import * as promotions from '@utils/testData/promotions'
import { InMemoryPromotionGateway } from '@core/usecases/promotions/promotions-listing/inMemoryPromotionGateway'

export const usePromotionGateway = () => {
  const promotionGateway = new InMemoryPromotionGateway()
  promotionGateway.feedWith(...Object.values(promotions))
  return promotionGateway
}
