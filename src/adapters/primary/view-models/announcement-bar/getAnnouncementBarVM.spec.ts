import {
  GetAnnouncementBarVM,
  getAnnouncementBarVM
} from '@adapters/primary/view-models/announcement-bar/getAnnouncementBarVM'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar2
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'

describe('Get announcement bar VM', () => {
  let announcementBarStore: any
  const dateProvider = new FakeDateProvider()

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarStore = useAnnouncementBarStore()
    dateProvider.feedWith(1700000000000)
  })

  describe('There is no announcement bar', () => {
    it('should return null', () => {
      const vm = getAnnouncementBarVM(dateProvider)
      expect(vm).toBeNull()
    })
  })

  describe('There is an announcement bar', () => {
    it('should return VM with computed isInProgress field', () => {
      announcementBarStore.setAnnouncementBar(announcementBar1)
      const vm = getAnnouncementBarVM(dateProvider)
      const expected: GetAnnouncementBarVM = {
        uuid: announcementBar1.uuid,
        text: announcementBar1.text,
        isActive: announcementBar1.isActive,
        startDate: undefined,
        endDate: undefined,
        isInProgress: true,
        isLoading: false
      }
      expect(vm).toStrictEqual(expected)
    })
  })

  describe('Announcement bar with dates', () => {
    it('should format dates and compute isInProgress', () => {
      announcementBarStore.setAnnouncementBar(announcementBar2)
      const vm = getAnnouncementBarVM(dateProvider)
      const expected: GetAnnouncementBarVM = {
        uuid: announcementBar2.uuid,
        text: announcementBar2.text,
        isActive: announcementBar2.isActive,
        startDate: announcementBar2.startDate,
        endDate: undefined,
        isInProgress: false,
        isLoading: false
      }
      expect(vm).toStrictEqual(expected)
    })
  })
})
