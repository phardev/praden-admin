import { NO_ANNOUNCEMENT_BAR_IMPACT } from '@core/entities/announcementBar'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  longFreeDeliveryBar,
  weekendPromoBar
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAnnouncementBarImpactVM } from './getAnnouncementBarImpactVM'

describe('getAnnouncementBarImpactVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('The draft has no impact', () => {
    it('should have nothing to tell', () => {
      useAnnouncementBarStore().setImpact(NO_ANNOUNCEMENT_BAR_IMPACT)
      expect(getAnnouncementBarImpactVM()).toStrictEqual({
        replaces: [],
        maskedBy: []
      })
    })
  })

  describe('The draft replaces a bar and is masked by another', () => {
    beforeEach(() => {
      useAnnouncementBarStore().setImpact({
        replaces: [
          {
            from: weekendPromoBar.startDate!,
            to: weekendPromoBar.endDate! + 1,
            uuid: longFreeDeliveryBar.uuid,
            text: longFreeDeliveryBar.text
          }
        ],
        maskedBy: [
          {
            from: longFreeDeliveryBar.startDate!,
            to: longFreeDeliveryBar.endDate! + 1,
            uuid: weekendPromoBar.uuid,
            text: weekendPromoBar.text
          }
        ]
      })
    })

    it('should describe each period with its bar', () => {
      expect(getAnnouncementBarImpactVM()).toStrictEqual({
        replaces: [
          {
            text: longFreeDeliveryBar.text,
            startLabel: '24 sept. 2026',
            endLabel: '26 sept. 2026'
          }
        ],
        maskedBy: [
          {
            text: weekendPromoBar.text,
            startLabel: '31 mars 2026',
            endLabel: '31 janv. 2027'
          }
        ]
      })
    })
  })
})
