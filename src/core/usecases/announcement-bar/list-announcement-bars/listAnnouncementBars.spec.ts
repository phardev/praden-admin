import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { AnnouncementBar } from '@core/entities/announcementBar'
import { listAnnouncementBars } from '@core/usecases/announcement-bar/list-announcement-bars/listAnnouncementBars'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3
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
