import { banner1, banner2, banner3 } from '@utils/testData/banners'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('plop')
const gateway = new InMemoryBannerGateway(uuidGenerator)
gateway.feedWith(banner3, banner1, banner2)

export const useBannerGateway = (): BannerGateway => {
  return gateway
}
