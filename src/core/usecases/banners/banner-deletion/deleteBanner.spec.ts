import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { useBannerStore } from '@store/bannerStore'
import { Banner } from '@core/entities/banner'
import { banner1, banner2, banner3 } from '@utils/testData/banners'
import { UUID } from '@core/types/types'
import { deleteBanner } from '@core/usecases/banners/banner-deletion/deleteBanner'
import { createPinia, setActivePinia } from 'pinia'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

describe('Banner deletion', () => {
  let bannerGateway: InMemoryBannerGateway
  let bannerStore: any
  let expectedBanners: Array<Banner>

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerGateway = new InMemoryBannerGateway(new FakeUuidGenerator())
    bannerStore = useBannerStore()
  })

  describe('The banner exists', () => {
    beforeEach(() => {
      givenExistingBanners(banner1, banner2, banner3)
    })
    describe('For a banner', () => {
      beforeEach(async () => {
        await whenDeleteBanner(banner1.uuid)
        expectedBanners = [
          {
            ...banner2,
            order: 0
          },
          {
            ...banner3,
            order: 1
          }
        ]
      })
      it('should delete the banner from the gateway', async () => {
        expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
      })
      it('should delete the banner from the store', () => {
        expect(bannerStore.items).toStrictEqual(expectedBanners)
      })
    })
    describe('For another banner', () => {
      beforeEach(async () => {
        await whenDeleteBanner(banner2.uuid)
        expectedBanners = [
          {
            ...banner1
          },
          {
            ...banner3,
            order: 1
          }
        ]
      })
      it('should delete the banner from the gateway', async () => {
        expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
      })
      it('should delete the banner from the store', () => {
        expect(bannerStore.items).toStrictEqual(expectedBanners)
      })
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
    bannerStore.items = JSON.parse(JSON.stringify(banners))
  }

  const whenDeleteBanner = async (bannerUuid: UUID) => {
    await deleteBanner(bannerUuid, bannerGateway)
  }
})
