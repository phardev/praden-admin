import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { AnnouncementBar } from '@core/entities/announcementBar'
import { AnnouncementBarDoesNotExistsError } from '@core/errors/AnnouncementBarDoesNotExistsError'
import { UUID } from '@core/types/types'
import { getAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-get/getAnnouncementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3,
  announcementBar4
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'

describe('AnnouncementBar get', () => {
  let announcementBarStore: any
  let announcementBarGateway: InMemoryAnnouncementBarGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarStore = useAnnouncementBarStore()
    announcementBarGateway = new InMemoryAnnouncementBarGateway(
      new FakeUuidGenerator()
    )
  })

  describe('Get an announcement bar', () => {
    it('should save the announcement bar in the store', async () => {
      givenExistingAnnouncementBars(
        announcementBar1,
        announcementBar2,
        announcementBar3
      )
      await whenGetAnnouncementBar(announcementBar2.uuid)
      expectCurrentAnnouncementBarToBe(announcementBar2)
    })
  })

  describe('Get another announcement bar', () => {
    it('should save the announcement bar in the store', async () => {
      givenExistingAnnouncementBars(announcementBar1, announcementBar4)
      await whenGetAnnouncementBar(announcementBar4.uuid)
      expectCurrentAnnouncementBarToBe(announcementBar4)
    })
  })

  describe('The announcement bar does not exist', () => {
    it('should throw an error', async () => {
      await expect(whenGetAnnouncementBar('not-exists')).rejects.toThrow(
        AnnouncementBarDoesNotExistsError
      )
    })
  })

  const givenExistingAnnouncementBars = (
    ...announcementBars: Array<AnnouncementBar>
  ) => {
    announcementBarGateway.feedWith(...announcementBars)
  }

  const whenGetAnnouncementBar = async (uuid: UUID) => {
    await getAnnouncementBar(uuid, announcementBarGateway)
  }

  const expectCurrentAnnouncementBarToBe = (
    announcementBar: AnnouncementBar
  ) => {
    expect(announcementBarStore.current).toStrictEqual(announcementBar)
  }
})
