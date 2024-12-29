import * as banners from '@utils/testData/banners'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import { RealBannerGateway } from '@adapters/secondary/banner-gateways/realBannerGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('plop')
const gateway = new InMemoryBannerGateway(uuidGenerator)
gateway.feedWith(...Object.values(banners))

export const useBannerGateway = (): BannerGateway => {
  if (isLocalEnv()) {
    return gateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealBannerGateway(BACKEND_URL)
}
