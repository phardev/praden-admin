import { InMemoryBannerGateway } from '@adapters/secondary/banner-gateways/inMemoryBannerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Banner } from '@core/entities/banner'
import { UUID } from '@core/types/types'
import {
  EditBannerDTO,
  editBanner
} from '@core/usecases/banners/banner-edition/editBanner'
import { useBannerStore } from '@store/bannerStore'
import { banner1, banner2, banner3 } from '@utils/testData/banners'
import { createPinia, setActivePinia } from 'pinia'

describe('Banner Edition', () => {
  let bannerGateway: InMemoryBannerGateway
  let bannerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerGateway = new InMemoryBannerGateway(new FakeUuidGenerator())
    bannerStore = useBannerStore()
  })

  describe('The banner exists', () => {
    let expectedBanners: Array<Banner>
    beforeEach(() => {
      givenExistingBanners(banner1, banner2, banner3)
    })
    describe('Update isActive field', () => {
      beforeEach(async () => {
        const dto: EditBannerDTO = { isActive: false }
        const uuid = banner1.uuid
        expectedBanners = [
          {
            ...banner1,
            isActive: false
          },
          banner2,
          banner3
        ]
        await whenEditBanner(uuid, dto)
      })
      it('should update field in gateway', async () => {
        expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
      })
      it('should update field in store', () => {
        expect(bannerStore.items).toStrictEqual(expectedBanners)
      })
    })
    describe('Update order field', () => {
      beforeEach(async () => {
        const dto: EditBannerDTO = { order: 0 }
        const uuid = banner3.uuid
        expectedBanners = [
          {
            ...banner3,
            order: 0
          },
          {
            ...banner1,
            order: 1
          },
          {
            ...banner2,
            order: 2
          }
        ]
        await whenEditBanner(uuid, dto)
      })
      it('should update field and reorder others in gateway', async () => {
        expect(await bannerGateway.list()).toStrictEqual(expectedBanners)
      })
      it('should update field and reorder others in store', () => {
        expect(bannerStore.items).toStrictEqual(expectedBanners)
      })
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerGateway.feedWith(...banners)
    bannerStore.items = banners
  }

  const whenEditBanner = async (uuid: UUID, dto: EditBannerDTO) => {
    await editBanner(uuid, dto, bannerGateway)
  }
})
