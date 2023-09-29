import { RealPromotionGateway } from '@adapters/secondary/promotion-gateways/RealPromotionGateway'

export const usePromotionGateway = () => {
  // const uuidGenerator = new FakeUuidGenerator()
  // uuidGenerator.setNext('abc123')
  // const promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
  // promotionGateway.feedWith(...Object.values(promotions))
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealPromotionGateway(BACKEND_URL)
}
