import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  AnnouncementBar,
  EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
} from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import { deleteAnnouncementBar } from '@core/usecases/announcement-bar/announcement-bar-deletion/deleteAnnouncementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3,
  longFreeDeliveryBar,
  weekendPromoBar
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
        expectedAnnouncementBars = [announcementBar2, announcementBar3]
      })
      it('should delete the announcement bar from the gateway', async () => {
        expect(await announcementBarGateway.list()).toStrictEqual({
          items: expectedAnnouncementBars,
          displayedUuid: undefined,
          schedule: EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
        })
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
        expectedAnnouncementBars = [announcementBar1, announcementBar3]
      })
      it('should delete the announcement bar from the gateway', async () => {
        expect(await announcementBarGateway.list()).toStrictEqual({
          items: expectedAnnouncementBars,
          displayedUuid: undefined,
          schedule: EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
        })
      })
      it('should delete the announcement bar from the store', () => {
        expect(announcementBarStore.items).toStrictEqual(
          expectedAnnouncementBars
        )
      })
    })
  })

  describe('Deleting the displayed announcement bar', () => {
    beforeEach(async () => {
      givenExistingAnnouncementBars(longFreeDeliveryBar, weekendPromoBar)
      announcementBarGateway.feedDisplayedWith(longFreeDeliveryBar.uuid)
      await whenDeleteAnnouncementBar(weekendPromoBar.uuid)
    })
    it('should refresh the displayed announcement bar in the store', () => {
      expect(announcementBarStore.displayedUuid).toStrictEqual(
        longFreeDeliveryBar.uuid
      )
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
