import {
  AnnouncementBar,
  AnnouncementBarSchedule,
  EMPTY_ANNOUNCEMENT_BAR_SCHEDULE
} from '@core/entities/announcementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  announcementBar4,
  blackFridayBar,
  longFreeDeliveryBar,
  pausedSeptemberBar,
  weekendPromoBar,
  weekendThenLongSchedule,
  weekendThenNothingSchedule
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAnnouncementBarsTimelineVM } from './getAnnouncementBarsTimelineVM'

describe('getAnnouncementBarsTimelineVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('There is no schedule yet', () => {
    it('should return an empty timeline', () => {
      givenAnnouncementBars([], EMPTY_ANNOUNCEMENT_BAR_SCHEDULE)
      expect(getAnnouncementBarsTimelineVM()).toStrictEqual({
        ticks: [],
        weekLines: [],
        site: [],
        rows: [],
        changes: []
      })
    })
  })

  describe('A weekend promo, a long bar, a Black Friday and a paused bar', () => {
    beforeEach(() => {
      givenAnnouncementBars(
        [
          pausedSeptemberBar,
          blackFridayBar,
          longFreeDeliveryBar,
          weekendPromoBar,
          announcementBar4
        ],
        weekendThenLongSchedule
      )
    })

    it('should show which bar is on the site for each period', () => {
      expect(getAnnouncementBarsTimelineVM().site).toStrictEqual([
        {
          uuid: weekendPromoBar.uuid,
          text: weekendPromoBar.text,
          isGap: false,
          colorIndex: 0,
          leftPercent: 0,
          widthPercent: 2.22,
          startLabel: '24 sept.',
          endLabel: '26 sept.'
        },
        {
          uuid: longFreeDeliveryBar.uuid,
          text: longFreeDeliveryBar.text,
          isGap: false,
          colorIndex: 1,
          leftPercent: 2.22,
          widthPercent: 67.82,
          startLabel: '26 sept.',
          endLabel: '26 nov.'
        },
        {
          uuid: blackFridayBar.uuid,
          text: blackFridayBar.text,
          isGap: false,
          colorIndex: 2,
          leftPercent: 70.05,
          widthPercent: 5.56,
          startLabel: '26 nov.',
          endLabel: '1 déc.'
        },
        {
          uuid: longFreeDeliveryBar.uuid,
          text: longFreeDeliveryBar.text,
          isGap: false,
          colorIndex: 1,
          leftPercent: 75.6,
          widthPercent: 24.4,
          startLabel: '1 déc.',
          endLabel: '23 déc.'
        }
      ])
    })

    it('should show each bar with its displayed, masked and paused periods, paused bars last', () => {
      expect(getAnnouncementBarsTimelineVM().rows).toStrictEqual([
        {
          uuid: weekendPromoBar.uuid,
          text: weekendPromoBar.text,
          colorIndex: 0,
          segments: [
            {
              state: 'DISPLAYED',
              leftPercent: 0,
              widthPercent: 2.22,
              startLabel: '24 sept.',
              endLabel: '26 sept.'
            }
          ]
        },
        {
          uuid: longFreeDeliveryBar.uuid,
          text: longFreeDeliveryBar.text,
          colorIndex: 1,
          segments: [
            {
              state: 'MASKED',
              leftPercent: 0,
              widthPercent: 2.22,
              startLabel: '24 sept.',
              endLabel: '26 sept.'
            },
            {
              state: 'DISPLAYED',
              leftPercent: 2.22,
              widthPercent: 67.82,
              startLabel: '26 sept.',
              endLabel: '26 nov.'
            },
            {
              state: 'MASKED',
              leftPercent: 70.05,
              widthPercent: 5.56,
              startLabel: '26 nov.',
              endLabel: '1 déc.'
            },
            {
              state: 'DISPLAYED',
              leftPercent: 75.6,
              widthPercent: 24.4,
              startLabel: '1 déc.',
              endLabel: '23 déc.'
            }
          ]
        },
        {
          uuid: blackFridayBar.uuid,
          text: blackFridayBar.text,
          colorIndex: 2,
          segments: [
            {
              state: 'DISPLAYED',
              leftPercent: 70.05,
              widthPercent: 5.56,
              startLabel: '26 nov.',
              endLabel: '1 déc.'
            }
          ]
        },
        {
          uuid: pausedSeptemberBar.uuid,
          text: pausedSeptemberBar.text,
          colorIndex: 3,
          segments: [
            {
              state: 'PAUSED',
              leftPercent: 0,
              widthPercent: 6.67,
              startLabel: '24 sept.',
              endLabel: '30 sept.'
            }
          ]
        }
      ])
    })

    it('should list the upcoming changes on the site', () => {
      expect(getAnnouncementBarsTimelineVM().changes).toStrictEqual([
        {
          dateLabel: 'sam. 26 sept.',
          text: longFreeDeliveryBar.text,
          isGap: false,
          colorIndex: 1
        },
        {
          dateLabel: 'jeu. 26 nov.',
          text: blackFridayBar.text,
          isGap: false,
          colorIndex: 2
        },
        {
          dateLabel: 'mar. 1 déc.',
          text: longFreeDeliveryBar.text,
          isGap: false,
          colorIndex: 1
        }
      ])
    })

    it('should draw a line for each monday', () => {
      expect(getAnnouncementBarsTimelineVM().weekLines).toStrictEqual([
        3.43, 11.2, 18.98, 26.76, 34.54, 42.31, 50.09, 57.87, 65.65, 73.43,
        81.2, 88.98, 96.76
      ])
    })

    it('should mark the beginning of each month', () => {
      expect(getAnnouncementBarsTimelineVM().ticks).toStrictEqual([
        { label: 'oct.', leftPercent: 6.76 },
        { label: 'nov.', leftPercent: 41.2 },
        { label: 'déc.', leftPercent: 74.54 }
      ])
    })
  })

  describe('Nothing follows the weekend promo', () => {
    beforeEach(() => {
      givenAnnouncementBars([weekendPromoBar], weekendThenNothingSchedule)
    })

    it('should show a gap on the site after the promo', () => {
      expect(getAnnouncementBarsTimelineVM().site).toStrictEqual([
        {
          uuid: weekendPromoBar.uuid,
          text: weekendPromoBar.text,
          isGap: false,
          colorIndex: 0,
          leftPercent: 0,
          widthPercent: 2.22,
          startLabel: '24 sept.',
          endLabel: '26 sept.'
        },
        {
          uuid: undefined,
          text: '',
          isGap: true,
          colorIndex: undefined,
          leftPercent: 2.22,
          widthPercent: 97.78,
          startLabel: '26 sept.',
          endLabel: '23 déc.'
        }
      ])
    })
  })

  describe('Nothing follows the weekend promo on the list of changes', () => {
    beforeEach(() => {
      givenAnnouncementBars([weekendPromoBar], weekendThenNothingSchedule)
    })

    it('should announce the period without bar', () => {
      expect(getAnnouncementBarsTimelineVM().changes).toStrictEqual([
        {
          dateLabel: 'sam. 26 sept.',
          text: '',
          isGap: true,
          colorIndex: undefined
        }
      ])
    })
  })

  const givenAnnouncementBars = (
    items: Array<AnnouncementBar>,
    schedule: AnnouncementBarSchedule
  ) => {
    useAnnouncementBarStore().list({
      items,
      displayedUuid: schedule.segments[0]?.displayedUuid,
      schedule
    })
  }
})
