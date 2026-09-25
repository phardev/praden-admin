import { InMemoryAnnouncementBarGateway } from '@adapters/secondary/announcement-bar-gateways/inMemoryAnnouncementBarGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  AnnouncementBarImpact,
  NO_ANNOUNCEMENT_BAR_IMPACT
} from '@core/entities/announcementBar'
import { AnnouncementBarDraft } from '@core/gateways/announcementBarGateway'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  longFreeDeliveryBar,
  weekendPromoBar
} from '@utils/testData/announcementBars'
import { createPinia, setActivePinia } from 'pinia'
import { previewAnnouncementBarSchedule } from './previewAnnouncementBarSchedule'

describe('Preview announcement bar schedule', () => {
  let announcementBarGateway: InMemoryAnnouncementBarGateway
  let announcementBarStore: any

  const weekendDraft: AnnouncementBarDraft = {
    isActive: true,
    startDate: new Date(weekendPromoBar.startDate!).toISOString(),
    endDate: new Date(weekendPromoBar.endDate!).toISOString()
  }

  const replacesLongFreeDelivery: AnnouncementBarImpact = {
    replaces: [
      {
        from: weekendPromoBar.startDate!,
        to: weekendPromoBar.endDate! + 1,
        uuid: longFreeDeliveryBar.uuid,
        text: longFreeDeliveryBar.text
      }
    ],
    maskedBy: []
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    announcementBarGateway = new InMemoryAnnouncementBarGateway(
      new FakeUuidGenerator()
    )
    announcementBarStore = useAnnouncementBarStore()
  })

  describe('The draft replaces another bar', () => {
    beforeEach(async () => {
      announcementBarGateway.feedImpactWith(
        weekendDraft,
        replacesLongFreeDelivery
      )
      await previewAnnouncementBarSchedule(weekendDraft, announcementBarGateway)
    })

    it('should store the impact of the draft', () => {
      expect(announcementBarStore.impact).toStrictEqual(
        replacesLongFreeDelivery
      )
    })
  })

  describe('The draft has no impact', () => {
    beforeEach(async () => {
      announcementBarStore.setImpact(replacesLongFreeDelivery)
      await previewAnnouncementBarSchedule(
        { ...weekendDraft, isActive: false },
        announcementBarGateway
      )
    })

    it('should replace the previous impact', () => {
      expect(announcementBarStore.impact).toStrictEqual(
        NO_ANNOUNCEMENT_BAR_IMPACT
      )
    })
  })
})
