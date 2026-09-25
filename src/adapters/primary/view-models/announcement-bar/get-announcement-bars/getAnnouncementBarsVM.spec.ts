import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import {
  AnnouncementBar,
  EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
} from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar1,
  announcementBar3,
  announcementBar4,
  blackFridayBar,
  longFreeDeliveryBar,
  pausedSeptemberBar,
  weekendPromoBar
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAnnouncementBarsVM } from './getAnnouncementBarsVM'

describe('getAnnouncementBarsVM', () => {
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(weekendPromoBar.startDate! + 1)
  })

  describe('There is no announcement bar', () => {
    it('should return empty groups', () => {
      givenAnnouncementBars([])
      expect(getAnnouncementBarsVM(dateProvider)).toStrictEqual({
        displayed: undefined,
        upcoming: [],
        ended: []
      })
    })
  })

  describe('A short promo overlaps a long announcement bar', () => {
    beforeEach(() => {
      givenAnnouncementBars(
        [
          pausedSeptemberBar,
          blackFridayBar,
          longFreeDeliveryBar,
          weekendPromoBar,
          announcementBar4
        ],
        weekendPromoBar.uuid
      )
    })

    it('should show the short promo as displayed', () => {
      expect(getAnnouncementBarsVM(dateProvider).displayed).toStrictEqual({
        uuid: weekendPromoBar.uuid,
        text: weekendPromoBar.text,
        startDate: '24 sept. 2026',
        endDate: '26 sept. 2026',
        status: 'DISPLAYED'
      })
    })

    it('should list masked, then scheduled, then paused bars as upcoming', () => {
      expect(getAnnouncementBarsVM(dateProvider).upcoming).toStrictEqual([
        {
          uuid: longFreeDeliveryBar.uuid,
          text: longFreeDeliveryBar.text,
          startDate: '31 mars 2026',
          endDate: '31 janv. 2027',
          status: 'MASKED',
          maskedBy: {
            text: weekendPromoBar.text,
            endDate: '26 sept. 2026'
          }
        },
        {
          uuid: blackFridayBar.uuid,
          text: blackFridayBar.text,
          startDate: '26 nov. 2026',
          endDate: '1 déc. 2026',
          status: 'SCHEDULED'
        },
        {
          uuid: pausedSeptemberBar.uuid,
          text: pausedSeptemberBar.text,
          startDate: '1 sept. 2026',
          endDate: '30 sept. 2026',
          status: 'PAUSED'
        }
      ])
    })

    it('should list ended bars', () => {
      expect(getAnnouncementBarsVM(dateProvider).ended).toStrictEqual([
        {
          uuid: announcementBar4.uuid,
          text: announcementBar4.text,
          startDate: '1 juil. 2024',
          endDate: '1 août 2024',
          status: 'ENDED'
        }
      ])
    })
  })

  describe('A bar without end date is masked by a bar without end date', () => {
    beforeEach(() => {
      givenAnnouncementBars(
        [announcementBar1, { ...longFreeDeliveryBar, endDate: undefined }],
        announcementBar1.uuid
      )
    })

    it('should show the masking bar without end date', () => {
      expect(getAnnouncementBarsVM(dateProvider).upcoming).toStrictEqual([
        {
          uuid: longFreeDeliveryBar.uuid,
          text: longFreeDeliveryBar.text,
          startDate: '31 mars 2026',
          endDate: '',
          status: 'MASKED',
          maskedBy: {
            text: announcementBar1.text,
            endDate: ''
          }
        }
      ])
    })
  })

  describe('Several bars have ended', () => {
    beforeEach(() => {
      givenAnnouncementBars([announcementBar4, announcementBar3])
    })

    it('should list the most recently ended first', () => {
      expect(getAnnouncementBarsVM(dateProvider).ended).toStrictEqual([
        {
          uuid: announcementBar3.uuid,
          text: announcementBar3.text,
          startDate: '',
          endDate: '2 févr. 2025',
          status: 'ENDED'
        },
        {
          uuid: announcementBar4.uuid,
          text: announcementBar4.text,
          startDate: '1 juil. 2024',
          endDate: '1 août 2024',
          status: 'ENDED'
        }
      ])
    })
  })

  describe('Several bars are scheduled', () => {
    beforeEach(() => {
      givenAnnouncementBars([
        blackFridayBar,
        { ...weekendPromoBar, startDate: weekendPromoBar.startDate! + 2 }
      ])
    })

    it('should list the next one to start first', () => {
      expect(
        getAnnouncementBarsVM(dateProvider).upcoming.map((bar) => bar.uuid)
      ).toStrictEqual([weekendPromoBar.uuid, blackFridayBar.uuid])
    })
  })

  const givenAnnouncementBars = (
    items: Array<AnnouncementBar>,
    displayedUuid?: UUID
  ) => {
    useAnnouncementBarStore().list({
      items,
      displayedUuid,
      schedule: EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
    })
  }
})
