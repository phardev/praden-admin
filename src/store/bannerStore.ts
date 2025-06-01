import { Banner } from '@core/entities/banner'
import { defineStore } from 'pinia'

export const useBannerStore = defineStore('BannerStore', {
  state: () => {
    return {
      items: [] as Array<Banner>,
      current: undefined as Banner | undefined
    }
  },
  actions: {
    list(banners: Array<Banner>) {
      this.items = banners
    },
    setCurrent(banner: Banner) {
      this.current = JSON.parse(JSON.stringify(banner))
    },
    edit(banner: Banner) {
      const index = this.items.findIndex((b) => b.uuid === banner.uuid)
      this.items.splice(index, 1)
      this.items.splice(banner.order, 0, banner)
      this.items.forEach((b, i) => {
        b.order = i
      })
    },
    delete(banner: Banner) {
      const index = this.items.findIndex((b) => b.uuid === banner.uuid)
      this.items.splice(index, 1)
      this.items.forEach((b, i) => {
        b.order = i
      })
    }
  }
})
