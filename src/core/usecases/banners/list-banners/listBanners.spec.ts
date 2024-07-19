import { Banner } from '@core/entities/banner'
import { createPinia, setActivePinia } from 'pinia'
import { useBannerStore } from '@store/bannerStore'
import { listBanners } from '@core/usecases/banners/list-banners/listBanners'
import { banner1, banner2, banner3 } from '@utils/testData/banners'
import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'

describe('List banners', () => {
  let bannerStore: any
  let bannerGateway: InMemoryBannerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerStore = useBannerStore()
    bannerGateway = new InMemoryBannerGateway()
  })
  describe('There is no banners', () => {
    it('should list nothing', async () => {
      await whenListBanners()
      expectBannerStoreToContains()
    })
  })

  describe('There is some banners', () => {
    it('should list all of them', async () => {
      givenExistingBanners(banner1, banner2, banner3)
      await whenListBanners()
      expectBannerStoreToContains(banner1, banner2, banner3)
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
  }

  const whenListBanners = async () => {
    await listBanners(bannerGateway)
  }

  const expectBannerStoreToContains = (...banners: Array<Banner>) => {
    expect(bannerStore.items).toStrictEqual(banners)
  }
})
