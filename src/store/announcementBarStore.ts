import { AnnouncementBar } from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useAnnouncementBarStore = defineStore('AnnouncementBarStore', {
  state: () => {
    return {
      items: [] as Array<AnnouncementBar>,
      current: undefined as AnnouncementBar | undefined,
      isLoading: false
    }
  },
  getters: {
    announcementBar: (state) => state.current
  },
  actions: {
    list(announcementBars: Array<AnnouncementBar>) {
      this.items = announcementBars
    },
    setCurrent(announcementBar: AnnouncementBar) {
      this.current = JSON.parse(JSON.stringify(announcementBar))
    },
    setAnnouncementBar(announcementBar: AnnouncementBar) {
      this.current = announcementBar
    },
    edit(announcementBar: AnnouncementBar) {
      const index = this.items.findIndex((b) => b.uuid === announcementBar.uuid)
      this.items.splice(index, 1)
      this.items.splice(announcementBar.order, 0, announcementBar)
      this.items.forEach((b, i) => {
        b.order = i
      })
    },
    delete(announcementBar: AnnouncementBar) {
      const index = this.items.findIndex((b) => b.uuid === announcementBar.uuid)
      this.items.splice(index, 1)
      this.items.forEach((b, i) => {
        b.order = i
      })
    },
    remove(uuid: UUID) {
      const index = this.items.findIndex((b) => b.uuid === uuid)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.items.forEach((b, i) => {
          b.order = i
        })
      }
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
