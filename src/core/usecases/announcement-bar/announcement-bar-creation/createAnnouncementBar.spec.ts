import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { AnnouncementBar } from '@core/entities/announcementBar'
import {
  CreateAnnouncementBarDTO,
  createAnnouncementBar
} from '@core/usecases/announcement-bar/announcement-bar-creation/createAnnouncementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'

describe('Create announcement bar', () => {
  let announcementBarGateway: InMemoryAnnouncementBarGateway
  let announcementBarStore: any
  const uuidGenerator = new FakeUuidGenerator()
  let expectedAnnouncementBar: AnnouncementBar
  let uuid: string
  let dto: CreateAnnouncementBarDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarGateway = new InMemoryAnnouncementBarGateway(uuidGenerator)
    announcementBarStore = useAnnouncementBarStore()
  })
  describe('For a simple announcement bar', () => {
    beforeEach(async () => {
      uuid = 'new-uuid'
      dto = {
        text: 'New announcement bar text',
        isActive: true
      }
      expectedAnnouncementBar = {
        uuid,
        text: 'New announcement bar text',
        order: 0,
        isActive: true
      }
      uuidGenerator.setNext(uuid)
      await whenAddAnnouncementBar(dto)
    })
    it('should add the announcement bar in the gateway', async () => {
      expect(await announcementBarGateway.list()).toStrictEqual([
        expectedAnnouncementBar
      ])
    })
    it('should add the announcement bar in the store', () => {
      expect(announcementBarStore.items).toStrictEqual([
        expectedAnnouncementBar
      ])
    })
  })

  describe('For another announcement bar', () => {
    beforeEach(async () => {
      givenExistingAnnouncementBars(announcementBar1, announcementBar2)
      uuid = 'another-new-uuid'
      dto = {
        text: 'Another announcement bar text',
        isActive: false
      }
      expectedAnnouncementBar = {
        uuid,
        text: 'Another announcement bar text',
        order: 2,
        isActive: false
      }
      uuidGenerator.setNext(uuid)
      await whenAddAnnouncementBar(dto)
    })
    it('should add the announcement bar in the gateway', async () => {
      expect(await announcementBarGateway.list()).toStrictEqual([
        announcementBar1,
        announcementBar2,
        expectedAnnouncementBar
      ])
    })
    it('should add the announcement bar in the store', () => {
      expect(announcementBarStore.items).toStrictEqual([
        announcementBar1,
        announcementBar2,
        expectedAnnouncementBar
      ])
    })
  })

  describe('For an announcement bar with dates', () => {
    beforeEach(async () => {
      uuid = 'another-new-uuid'
      dto = {
        text: 'Announcement with dates',
        isActive: true,
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z'
      }
      expectedAnnouncementBar = {
        uuid,
        text: 'Announcement with dates',
        order: 0,
        isActive: true,
        startDate: 1705276800000,
        endDate: 1735689599999
      }
      uuidGenerator.setNext(uuid)
      await whenAddAnnouncementBar(dto)
    })
    it('should add the announcement bar in the gateway', async () => {
      expect(await announcementBarGateway.list()).toStrictEqual([
        expectedAnnouncementBar
      ])
    })
    it('should add the announcement bar in the store', () => {
      expect(announcementBarStore.items).toStrictEqual([
        expectedAnnouncementBar
      ])
    })
  })

  const givenExistingAnnouncementBars = (
    ...announcementBars: Array<AnnouncementBar>
  ) => {
    announcementBarGateway.feedWith(...announcementBars)
    announcementBarStore.items = announcementBars
  }

  const whenAddAnnouncementBar = async (dto: CreateAnnouncementBarDTO) => {
    await createAnnouncementBar(dto, announcementBarGateway)
  }
})
