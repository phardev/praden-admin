import {
  AnnouncementBar,
  AnnouncementBarImpact,
  AnnouncementBarsListing,
  EMPTY_ANNOUNCEMENT_BAR_SCHEDULE,
  NO_ANNOUNCEMENT_BAR_IMPACT
} from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useAnnouncementBarStore = defineStore('AnnouncementBarStore', {
  state: () => {
    return {
      items: [] as Array<AnnouncementBar>,
      displayedUuid: undefined as UUID | undefined,
      schedule: EMPTY_ANNOUNCEMENT_BAR_SCHEDULE,
      impact: NO_ANNOUNCEMENT_BAR_IMPACT,
      current: undefined as AnnouncementBar | undefined,
      isLoading: false
    }
  },
  getters: {
    announcementBar: (state) => state.current
  },
  actions: {
    list(listing: AnnouncementBarsListing) {
      this.items = listing.items
      this.displayedUuid = listing.displayedUuid
      this.schedule = listing.schedule
    },
    setImpact(impact: AnnouncementBarImpact) {
      this.impact = impact
    },
    setCurrent(announcementBar: AnnouncementBar) {
      this.current = JSON.parse(JSON.stringify(announcementBar))
    },
    setAnnouncementBar(announcementBar: AnnouncementBar) {
      this.current = announcementBar
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
