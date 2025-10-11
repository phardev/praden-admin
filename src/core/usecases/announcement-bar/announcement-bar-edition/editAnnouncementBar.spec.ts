import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { createPinia, setActivePinia } from 'pinia'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2,
  announcementBar3
} from '@utils/testData/announcementBars'
import { AnnouncementBar } from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import {
  editAnnouncementBar,
  EditAnnouncementBarDTO
} from '@core/usecases/announcement-bar/announcement-bar-edition/editAnnouncementBar'

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
        expect(await announcementBarGateway.list()).toStrictEqual(
          expectedAnnouncementBars
        )
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
        expect(await announcementBarGateway.list()).toStrictEqual(
          expectedAnnouncementBars
        )
      })
      it('should update field in store', () => {
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
    announcementBarStore.items = announcementBars
  }

  const whenEditAnnouncementBar = async (
    uuid: UUID,
    dto: EditAnnouncementBarDTO
  ) => {
    await editAnnouncementBar(uuid, dto, announcementBarGateway)
  }
})
