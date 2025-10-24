import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { RealBannerGateway } from '@adapters/secondary/banner-gateways/realBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { isLocalEnv } from '@utils/env'
import * as banners from '@utils/testData/banners'

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
