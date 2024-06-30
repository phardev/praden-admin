import { Banner } from '@core/usecases/banners/list-banners/banner'
import { createPinia, setActivePinia } from 'pinia'
import { useBannerStore } from '@store/bannerStore'
import { banner1, banner2, banner3 } from '@utils/testData/banners'
import {
  GetBannersVM,
  getBannersVM
} from '@adapters/primary/view-models/banners/get-banners/getBannersVM'

describe('Get banners VM', () => {
  let bannerStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerStore = useBannerStore()
  })
  describe('There is no banners', () => {
    it('should get an empty VM', () => {
      const expectedVM: Partial<GetBannersVM> = {
        items: []
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('There is some banners', () => {
    it('should list all of them in order', async () => {
      givenExistingBanners(banner2, banner1, banner3)
      const expectedVM: Partial<GetBannersVM> = {
        items: [
          {
            uuid: banner1.uuid,
            img: banner1.img
          },
          {
            uuid: banner2.uuid,
            img: banner2.img
          },
          {
            uuid: banner3.uuid,
            img: banner3.img
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
  })

  const givenExistingBanners = (...banners: Array<Banner>) => {
    bannerStore.items = banners
  }

  const expectVMToMatch = (expectedVM: Partial<GetBannersVM>) => {
    const emptyVM: any = {
      items: []
    }
    expect(getBannersVM()).toMatchObject({ ...emptyVM, ...expectedVM })
  }
})
