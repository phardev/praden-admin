import { Banner, BannerListItem } from '@core/entities/banner'
import { defineStore } from 'pinia'

export const useBannerStore = defineStore('BannerStore', {
  state: () => {
    return {
      items: [] as Array<BannerListItem>,
      current: undefined as Banner | undefined
    }
  },
  actions: {
    list(banners: Array<BannerListItem>) {
      this.items = banners
    },
    setCurrent(banner: Banner) {
      this.current = JSON.parse(JSON.stringify(banner))
    },
    edit(banner: Banner) {
      const index = this.items.findIndex((b) => b.uuid === banner.uuid)
      const [previous] = this.items.splice(index, 1)
      this.items.splice(banner.order, 0, {
        ...banner,
        clickCount: previous.clickCount
      })
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
