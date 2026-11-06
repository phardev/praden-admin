import {
  GetBannersItemVM,
  GetBannersVM,
  getBannersVM
} from '@adapters/primary/view-models/banners/get-banners/getBannersVM'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { BannerListItem } from '@core/entities/banner'
import { useBannerStore } from '@store/bannerStore'
import {
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6
} from '@utils/testData/banners'
import { createPinia, setActivePinia } from 'pinia'

describe('Get banners VM', () => {
  let bannerStore: any
  const dateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    bannerStore = useBannerStore()
  })
  describe('There is no banners', () => {
    it('should get an empty VM', () => {
      const expectedVM: Partial<GetBannersVM> = {}
      expectVMToMatch(expectedVM)
    })
  })

  describe('There is some banners', () => {
    describe('For a date', () => {
      beforeEach(() => {
        dateProvider.feedWith(1721319876000)
      })
      it('should list all of them in order', async () => {
        givenExistingBanners(
          banner2,
          banner1,
          banner3,
          banner5,
          banner4,
          banner6
        )
        const expectedItems: Array<GetBannersItemVM> = [
          {
            uuid: banner1.uuid,
            img: banner1.img,
            isActive: true,
            clickCount: banner1.clickCount,
            formattedClickCount: String(banner1.clickCount),
            hasLink: true,
            startDate: '',
            startDatetime: new Date(''),
            endDate: '',
            endDatetime: new Date(''),
            isInProgress: true,
            isFuture: false
          },
          {
            uuid: banner2.uuid,
            img: banner2.img,
            isActive: false,
            clickCount: banner2.clickCount,
            formattedClickCount: String(banner2.clickCount),
            hasLink: true,
            startDate: '10 juin 2024',
            startDatetime: new Date('2024-06-10T16:24:36.000Z'),
            endDate: '',
            endDatetime: new Date(''),
            isInProgress: true,
            isFuture: false
          },
          {
            uuid: banner3.uuid,
            img: banner3.img,
            isActive: true,
            clickCount: banner3.clickCount,
            formattedClickCount: String(banner3.clickCount),
            hasLink: true,
            startDate: '',
            startDatetime: new Date(''),
            endDate: '10 oct. 2024',
            endDatetime: new Date('2024-10-10T16:24:36.000Z'),
            isInProgress: true,
            isFuture: false
          },
          {
            uuid: banner4.uuid,
            img: banner4.img,
            isActive: true,
            clickCount: banner4.clickCount,
            formattedClickCount: String(banner4.clickCount),
            hasLink: true,
            startDate: '18 août 2024',
            startDatetime: new Date('2024-08-18T16:24:36.000Z'),
            endDate: '18 sept. 2024',
            endDatetime: new Date('2024-09-18T16:24:36.000Z'),
            isInProgress: false,
            isFuture: true
          },
          {
            uuid: banner5.uuid,
            img: banner5.img,
            isActive: true,
            clickCount: banner5.clickCount,
            formattedClickCount: String(banner5.clickCount),
            hasLink: true,
            startDate: '20 juil. 2024',
            startDatetime: new Date('2024-07-20T16:24:36.000Z'),
            endDate: '20 août 2024',
            endDatetime: new Date('2024-08-20T16:24:36.000Z'),
            isInProgress: false,
            isFuture: true
          },
          {
            uuid: banner6.uuid,
            img: banner6.img,
            isActive: true,
            clickCount: banner6.clickCount,
            formattedClickCount: String(banner6.clickCount),
            hasLink: true,
            startDate: '10 juil. 2024',
            startDatetime: new Date('2024-07-10T16:24:36.000Z'),
            endDate: '20 juil. 2024',
            endDatetime: new Date('2024-07-20T16:24:36.000Z'),
            isInProgress: true,
            isFuture: false
          }
        ]
        const expectedVM: Partial<GetBannersVM> = {
          'En cours': {
            items: expectedItems
          },
          Tous: {
            items: expectedItems
          }
        }
        expectVMToMatch(expectedVM)
      })
    })
  })

  describe('Click count display', () => {
    beforeEach(() => {
      dateProvider.feedWith(1721319876000)
    })
    it('should flag a banner without link as not clickable', () => {
      const bannerWithoutLink: BannerListItem = { ...banner1, href: '' }
      givenExistingBanners(bannerWithoutLink)
      expectFirstItemToMatch({ uuid: banner1.uuid, hasLink: false })
    })
    it('should format a large click count with a thousands separator', () => {
      const popularBanner: BannerListItem = { ...banner1, clickCount: 1234 }
      givenExistingBanners(popularBanner)
      expectFirstItemToMatch({
        uuid: banner1.uuid,
        formattedClickCount: '1\u202f234'
      })
    })
  })

  const expectFirstItemToMatch = (item: Partial<GetBannersItemVM>) => {
    expect(getBannersVM(dateProvider).Tous.items[0]).toMatchObject(item)
  }

  const givenExistingBanners = (...banners: Array<BannerListItem>) => {
    bannerStore.items = banners
  }

  const expectVMToMatch = (expectedVM: Partial<GetBannersVM>) => {
    const emptyVM: GetBannersVM = {
      'En cours': {
        items: []
      },
      Tous: {
        items: []
      }
    }
    expect(getBannersVM(dateProvider)).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})
