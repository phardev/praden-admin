import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { AnnouncementBar } from '@core/entities/announcementBar'
import { listAnnouncementBars } from '@core/usecases/announcement-bar/list-announcement-bars/listAnnouncementBars'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3,
  longFreeDeliveryBar,
  weekendPromoBar,
  weekendThenLongSchedule
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'

describe('List announcement bars', () => {
  let announcementBarStore: any
  let announcementBarGateway: InMemoryAnnouncementBarGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarStore = useAnnouncementBarStore()
    announcementBarGateway = new InMemoryAnnouncementBarGateway(
      new FakeUuidGenerator()
    )
  })
  describe('There is no announcement bars', () => {
    it('should list nothing', async () => {
      await whenListAnnouncementBars()
      expectAnnouncementBarStoreToContains()
    })
  })

  describe('There is some announcement bars', () => {
    it('should list all of them', async () => {
      givenExistingAnnouncementBars(
        announcementBar1,
        announcementBar2,
        announcementBar3
      )
      await whenListAnnouncementBars()
      expectAnnouncementBarStoreToContains(
        announcementBar1,
        announcementBar2,
        announcementBar3
      )
    })
  })

  describe('One announcement bar is displayed on the shop', () => {
    beforeEach(async () => {
      givenExistingAnnouncementBars(announcementBar1, announcementBar3)
      givenDisplayedAnnouncementBarIs(announcementBar3.uuid)
      await whenListAnnouncementBars()
    })

    it('should store the displayed announcement bar', () => {
      expect(announcementBarStore.displayedUuid).toStrictEqual(
        announcementBar3.uuid
      )
    })
  })

  describe('The shop has a schedule for the coming months', () => {
    beforeEach(async () => {
      givenExistingAnnouncementBars(longFreeDeliveryBar, weekendPromoBar)
      announcementBarGateway.feedScheduleWith(weekendThenLongSchedule)
      await whenListAnnouncementBars()
    })

    it('should store the schedule', () => {
      expect(announcementBarStore.schedule).toStrictEqual(
        weekendThenLongSchedule
      )
    })
  })

  const givenDisplayedAnnouncementBarIs = (uuid: string) => {
    announcementBarGateway.feedDisplayedWith(uuid)
  }

  const givenExistingAnnouncementBars = (
    ...announcementBars: Array<AnnouncementBar>
  ) => {
    announcementBarGateway.feedWith(...announcementBars)
  }

  const whenListAnnouncementBars = async () => {
    await listAnnouncementBars(announcementBarGateway)
  }

  const expectAnnouncementBarStoreToContains = (
    ...announcementBars: Array<AnnouncementBar>
  ) => {
    expect(announcementBarStore.items).toStrictEqual(announcementBars)
  }
})
