import { Banner } from '@core/entities/banner'
import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { createPinia, setActivePinia } from 'pinia'
import { useBannerStore } from '@store/bannerStore'
import { banner1, banner2, banner3 } from '@utils/testData/banners'
import { reorderBanners } from '@core/usecases/banners/banners-reorder/reorderBanners'
import { UUID } from '@core/types/types'

describe('Banners reorder', () => {
  let bannerGateway: InMemoryBannerGateway
  let bannerStore: any
  let expectedBanners: Array<Banner>

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerGateway = new InMemoryBannerGateway(new FakeUuidGenerator())
    bannerStore = useBannerStore()
    givenExistingBanners(banner1, banner2, banner3)
  })

  describe('For a reorder', () => {
    beforeEach(async () => {
      expectedBanners = [
        {
          ...banner2,
          order: 0
        },
        {
          ...banner1,
          order: 1
        },
        {
          ...banner3,
          order: 2
        }
      ]
      await whenReorderBanners([banner2.uuid, banner1.uuid, banner3.uuid])
    })
    it('should reorder banners in gateway', async () => {
      expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
    })
    it('should reorder banners in store', () => {
      expect(bannerStore.items).toStrictEqual(expectedBanners)
    })
  })

  describe('For another reorder', () => {
    beforeEach(async () => {
      expectedBanners = [
        {
          ...banner3,
          order: 0
        },
        {
          ...banner2,
          order: 1
        },
        {
          ...banner1,
          order: 2
        }
      ]
      await whenReorderBanners([banner3.uuid, banner2.uuid, banner1.uuid])
    })
    it('should reorder banners in gateway', async () => {
      expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
    })
    it('should reorder banners in store', () => {
      expect(bannerStore.items).toStrictEqual(expectedBanners)
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
    bannerStore.items = banners
  }

  const whenReorderBanners = async (banners: Array<UUID>) => {
    await reorderBanners(banners, bannerGateway)
  }
})
