import {
  AnnouncementBar,
  isAnnouncementBarEnded,
  isAnnouncementBarInProgress,
  isAnnouncementBarStarted
} from '@core/entities/announcementBar'
import { Timestamp } from '@core/types/types'

describe('AnnouncementBar entity', () => {
  const now: Timestamp = 1700000000000
  const futureDate: Timestamp = 1800000000000
  const pastDate: Timestamp = 1600000000000

  const announcementBar: AnnouncementBar = {
    uuid: 'announcement-1',
    text: 'Test announcement',
    isActive: true
  }

  describe('isAnnouncementBarStarted', () => {
    it('should return false when startDate is in future', () => {
      const result = isAnnouncementBarStarted(
        { ...announcementBar, startDate: futureDate },
        now
      )
      expect(result).toBe(false)
    })

    it('should return true when startDate is in past', () => {
      const result = isAnnouncementBarStarted(
        { ...announcementBar, startDate: pastDate },
        now
      )
      expect(result).toBe(true)
    })

    it('should return true when startDate is undefined', () => {
      const result = isAnnouncementBarStarted(announcementBar, now)
      expect(result).toBe(true)
    })
  })

  describe('isAnnouncementBarEnded', () => {
    it('should return false when endDate is in future', () => {
      const result = isAnnouncementBarEnded(
        { ...announcementBar, endDate: futureDate },
        now
      )
      expect(result).toBe(false)
    })

    it('should return true when endDate is in past', () => {
      const result = isAnnouncementBarEnded(
        { ...announcementBar, endDate: pastDate },
        now
      )
      expect(result).toBe(true)
    })

    it('should return false when endDate is undefined', () => {
      const result = isAnnouncementBarEnded(announcementBar, now)
      expect(result).toBe(false)
    })
  })

  describe('isAnnouncementBarInProgress', () => {
    it('should return true when started and not ended', () => {
      const result = isAnnouncementBarInProgress(
        { ...announcementBar, startDate: pastDate, endDate: futureDate },
        now
      )
      expect(result).toBe(true)
    })

    it('should return false when not started', () => {
      const result = isAnnouncementBarInProgress(
        { ...announcementBar, startDate: futureDate },
        now
      )
      expect(result).toBe(false)
    })

    it('should return false when ended', () => {
      const result = isAnnouncementBarInProgress(
        { ...announcementBar, endDate: pastDate },
        now
      )
      expect(result).toBe(false)
    })
  })
})
