import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  AnnouncementBar,
  EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
} from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import {
  EditAnnouncementBarDTO,
  editAnnouncementBar
} from '@core/usecases/announcement-bar/announcement-bar-edition/editAnnouncementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3,
  longFreeDeliveryBar,
  weekendPromoBar
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'

describe('AnnouncementBar Edition', () => {
  let announcementBarGateway: InMemoryAnnouncementBarGateway
  let announcementBarStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarGateway = new InMemoryAnnouncementBarGateway(
      new FakeUuidGenerator()
    )
    announcementBarStore = useAnnouncementBarStore()
  })

  describe('The announcement bar exists', () => {
    let expectedAnnouncementBars: Array<AnnouncementBar>
    beforeEach(() => {
      givenExistingAnnouncementBars(
        announcementBar1,
        announcementBar2,
        announcementBar3
      )
    })
    describe('Update isActive field', () => {
      beforeEach(async () => {
        const dto: EditAnnouncementBarDTO = {
          isActive: false,
          text: announcementBar1.text
        }
        const uuid = announcementBar1.uuid
        expectedAnnouncementBars = [
          {
            ...announcementBar1,
            isActive: false
          },
          announcementBar2,
          announcementBar3
        ]
        await whenEditAnnouncementBar(uuid, dto)
      })
      it('should update field in gateway', async () => {
        expect(await announcementBarGateway.list()).toStrictEqual({
          items: expectedAnnouncementBars,
          displayedUuid: undefined,
          schedule: EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
        })
      })
      it('should update field in store', () => {
        expect(announcementBarStore.items).toStrictEqual(
          expectedAnnouncementBars
        )
      })
    })
    describe('Update text field', () => {
      beforeEach(async () => {
        const dto: EditAnnouncementBarDTO = {
          text: 'Updated announcement text',
          isActive: announcementBar2.isActive
        }
        const uuid = announcementBar2.uuid
        expectedAnnouncementBars = [
          announcementBar1,
          {
            ...announcementBar2,
            text: 'Updated announcement text'
          },
          announcementBar3
        ]
        await whenEditAnnouncementBar(uuid, dto)
      })
      it('should update field in gateway', async () => {
        expect(await announcementBarGateway.list()).toStrictEqual({
          items: expectedAnnouncementBars,
          displayedUuid: undefined,
          schedule: EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
        })
      })
      it('should update field in store', () => {
        expect(announcementBarStore.items).toStrictEqual(
          expectedAnnouncementBars
        )
      })
    })
  })

  describe('Pausing the displayed announcement bar', () => {
    beforeEach(async () => {
      givenExistingAnnouncementBars(longFreeDeliveryBar, weekendPromoBar)
      announcementBarGateway.feedDisplayedWith(longFreeDeliveryBar.uuid)
      await whenEditAnnouncementBar(weekendPromoBar.uuid, {
        text: weekendPromoBar.text,
        isActive: false
      })
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
    announcementBarStore.items = announcementBars
  }

  const whenEditAnnouncementBar = async (
    uuid: UUID,
    dto: EditAnnouncementBarDTO
  ) => {
    await editAnnouncementBar(uuid, dto, announcementBarGateway)
  }
})
