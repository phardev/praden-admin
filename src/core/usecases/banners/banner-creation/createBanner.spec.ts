import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { useBannerStore } from '@store/bannerStore'
import { Banner } from '@core/usecases/banners/list-banners/banner'
import { createBanner } from '@core/usecases/banners/banner-creation/createBanner'
import { createPinia, setActivePinia } from 'pinia'
import { banner1, banner2 } from '@utils/testData/banners'

describe('Create banner', () => {
  let bannerGateway: InMemoryBannerGateway
  let bannerStore: any
  const uuidGenerator = new FakeUuidGenerator()
  let expectedBanner: Banner
  let uuid

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerGateway = new InMemoryBannerGateway(uuidGenerator)
    bannerStore = useBannerStore()
  })
  describe('For a banner', () => {
    beforeEach(async () => {
      uuid = 'new-uuid'
      expectedBanner = {
        uuid,
        img: 'data:image/png;base64,ZGF0YTE=',
        order: 0,
        isActive: true
      }
      uuidGenerator.setNext(uuid)
      await whenAddBanner(new File(['data1'], 'File 1', { type: 'image/png' }))
    })
    it('should add the banner in the gateway', async () => {
      expect(await bannerGateway.list()).toStrictEqual([expectedBanner])
    })
    it('should add the banner in the store', () => {
      expect(bannerStore.items).toStrictEqual([expectedBanner])
    })
  })

  describe('For another banner', () => {
    beforeEach(async () => {
      givenExistingBanners(banner1, banner2)
      uuid = 'another-new-uuid'
      expectedBanner = {
        uuid,
        img: 'data:image/jpeg;base64,ZGF0YTI=',
        order: 2,
        isActive: true
      }
      uuidGenerator.setNext(uuid)
      await whenAddBanner(new File(['data2'], 'File 2', { type: 'image/jpeg' }))
    })
    it('should add the banner in the gateway', async () => {
      expect(await bannerGateway.list()).toStrictEqual([
        banner1,
        banner2,
        expectedBanner
      ])
    })
    it('should add the banner in the store', () => {
      expect(bannerStore.items).toStrictEqual([
        banner1,
        banner2,
        expectedBanner
      ])
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
    bannerStore.items = banners
  }

  const whenAddBanner = async (file: File) => {
    await createBanner(file, bannerGateway)
  }
})
