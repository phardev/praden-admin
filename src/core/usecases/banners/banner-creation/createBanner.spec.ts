import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Banner } from '@core/entities/banner'
import {
  CreateBannerDTO,
  createBanner
} from '@core/usecases/banners/banner-creation/createBanner'
import { useBannerStore } from '@store/bannerStore'
import { banner1, banner2 } from '@utils/testData/banners'
import { createPinia, setActivePinia } from 'pinia'

describe('Create banner', () => {
  let bannerGateway: InMemoryBannerGateway
  let bannerStore: any
  const uuidGenerator = new FakeUuidGenerator()
  let expectedBanner: Banner
  let uuid
  let dto: CreateBannerDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerGateway = new InMemoryBannerGateway(uuidGenerator)
    bannerStore = useBannerStore()
  })
  describe('For a simple banner', () => {
    beforeEach(async () => {
      uuid = 'new-uuid'
      dto = {
        img: new File(['data1'], 'File 1', { type: 'image/png' }),
        href: 'https://new-link.com'
      }
      expectedBanner = {
        uuid,
        img: 'data:image/png;base64,ZGF0YTE=',
        order: 0,
        isActive: true,
        href: 'https://new-link.com'
      }
      uuidGenerator.setNext(uuid)
      await whenAddBanner(dto)
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
      dto = {
        img: new File(['data1'], 'File 1', { type: 'image/png' }),
        href: 'https://another-link.com'
      }
      expectedBanner = {
        uuid,
        img: 'data:image/png;base64,ZGF0YTE=',
        href: 'https://another-link.com',
        order: 2,
        isActive: true
      }
      uuidGenerator.setNext(uuid)
      await whenAddBanner(dto)
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

  describe('For a banner with a specific order', () => {
    let expectedBanners: Array<Banner>
    beforeEach(async () => {
      givenExistingBanners(banner1, banner2)
      uuid = 'another-new-uuid'
      dto = {
        img: new File(['data1'], 'File 1', { type: 'image/png' }),
        href: 'https://another-link.com',
        order: 1
      }
      expectedBanner = {
        uuid,
        img: 'data:image/png;base64,ZGF0YTE=',
        href: 'https://another-link.com',
        order: 1,
        isActive: true
      }
      expectedBanners = [
        banner1,
        expectedBanner,
        {
          ...banner2,
          order: 2
        }
      ]
      uuidGenerator.setNext(uuid)
      await whenAddBanner(dto)
    })
    it('should add the banner in the gateway and reorder', async () => {
      expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
    })
    it('should add the banner in the store and reorder', () => {
      expect(bannerStore.items).toStrictEqual(expectedBanners)
    })
  })

  describe('For an inactive banner', () => {
    beforeEach(async () => {
      givenExistingBanners(banner1, banner2)
      uuid = 'another-new-uuid'
      dto = {
        img: new File(['data1'], 'File 1', { type: 'image/png' }),
        href: 'https://another-link.com',
        isActive: false
      }
      expectedBanner = {
        uuid,
        img: 'data:image/png;base64,ZGF0YTE=',
        href: 'https://another-link.com',
        order: 2,
        isActive: false
      }
      uuidGenerator.setNext(uuid)
      await whenAddBanner(dto)
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

  describe('For a banner with dates', () => {
    beforeEach(async () => {
      uuid = 'another-new-uuid'
      dto = {
        img: new File(['data1'], 'File 1', { type: 'image/png' }),
        href: 'https://another-link.com',
        startDate: 1234567890,
        endDate: 2345678901
      }
      expectedBanner = {
        uuid,
        img: 'data:image/png;base64,ZGF0YTE=',
        href: 'https://another-link.com',
        order: 0,
        isActive: true,
        startDate: 1234567890,
        endDate: 2345678901
      }
      uuidGenerator.setNext(uuid)
      await whenAddBanner(dto)
    })
    it('should add the banner in the gateway', async () => {
      expect(await bannerGateway.list()).toStrictEqual([expectedBanner])
    })
    it('should add the banner in the store', () => {
      expect(bannerStore.items).toStrictEqual([expectedBanner])
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
    bannerStore.items = banners
  }

  const whenAddBanner = async (dto: CreateBannerDTO) => {
    await createBanner(dto, bannerGateway)
  }
})
