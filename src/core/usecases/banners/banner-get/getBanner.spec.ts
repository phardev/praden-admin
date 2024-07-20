import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { useBannerStore } from '@store/bannerStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6
} from '@utils/testData/banners'
import { Banner } from '@core/entities/banner'
import { UUID } from '@core/types/types'
import { getBanner } from '@core/usecases/banners/banner-get/getBanner'
import { createPinia, setActivePinia } from 'pinia'
import { BannerDoesNotExistsError } from '@core/errors/BannerDoesNotExistsError'

describe('Banner get', () => {
  let bannerStore: any
  let bannerGateway: InMemoryBannerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerStore = useBannerStore()
    bannerGateway = new InMemoryBannerGateway(new FakeUuidGenerator())
  })

  describe('Get a banner', () => {
    it('should save the banner in the store', async () => {
      givenExistingBanners(banner1, banner2, banner3)
      await whenGetBanner(banner2.uuid)
      expectCurrentBannerToBe(banner2)
    })
  })

  describe('Get another banner', () => {
    it('should save the banner in the store', async () => {
      givenExistingBanners(banner4, banner5, banner6)
      await whenGetBanner(banner6.uuid)
      expectCurrentBannerToBe(banner6)
    })
  })

  describe('The banner does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetBanner('not-exists')).rejects.toThrow(
        BannerDoesNotExistsError
      )
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
  }

  const whenGetBanner = async (uuid: UUID) => {
    await getBanner(uuid, bannerGateway)
  }

  const expectCurrentBannerToBe = (banner: Banner) => {
    expect(bannerStore.current).toStrictEqual(banner)
  }
})
