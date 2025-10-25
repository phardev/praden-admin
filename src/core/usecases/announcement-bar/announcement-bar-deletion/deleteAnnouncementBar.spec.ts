import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { AnnouncementBar } from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import { deleteAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-deletion/deleteAnnouncementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'

describe('AnnouncementBar deletion', () => {
  let announcementBarGateway: InMemoryAnnouncementBarGateway
  let announcementBarStore: any
  let expectedAnnouncementBars: Array<AnnouncementBar>

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarGateway = new InMemoryAnnouncementBarGateway(
      new FakeUuidGenerator()
    )
    announcementBarStore = useAnnouncementBarStore()
  })

  describe('The announcement bar exists', () => {
    beforeEach(() => {
      givenExistingAnnouncementBars(
        announcementBar1,
        announcementBar2,
        announcementBar3
      )
    })
    describe('For an announcement bar', () => {
      beforeEach(async () => {
        await whenDeleteAnnouncementBar(announcementBar1.uuid)
        expectedAnnouncementBars = [
          {
            ...announcementBar2,
            order: 0
          },
          {
            ...announcementBar3,
            order: 1
          }
        ]
      })
      it('should delete the announcement bar from the gateway', async () => {
        expect(await announcementBarGateway.list()).toStrictEqual(
          expectedAnnouncementBars
        )
      })
      it('should delete the announcement bar from the store', () => {
        expect(announcementBarStore.items).toStrictEqual(
          expectedAnnouncementBars
        )
      })
    })
    describe('For another announcement bar', () => {
      beforeEach(async () => {
        await whenDeleteAnnouncementBar(announcementBar2.uuid)
        expectedAnnouncementBars = [
          {
            ...announcementBar1
          },
          {
            ...announcementBar3,
            order: 1
          }
        ]
      })
      it('should delete the announcement bar from the gateway', async () => {
        expect(await announcementBarGateway.list()).toStrictEqual(
          expectedAnnouncementBars
        )
      })
      it('should delete the announcement bar from the store', () => {
        expect(announcementBarStore.items).toStrictEqual(
          expectedAnnouncementBars
        )
      })
    })
  })

  const givenExistingAnnouncementBars = (
    ...announcementBars: Array<AnnouncementBar>
  ) => {
    announcementBarGateway.feedWith(...announcementBars)
    announcementBarStore.items = JSON.parse(JSON.stringify(announcementBars))
  }

  const whenDeleteAnnouncementBar = async (announcementBarUuid: UUID) => {
    await deleteAnnouncementBar(announcementBarUuid, announcementBarGateway)
  }
})
