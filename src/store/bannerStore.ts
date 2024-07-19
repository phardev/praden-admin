import { Banner, sortByOrder } from '@core/entities/banner'
import { defineStore } from 'pinia'

export const useBannerStore = defineStore('BannerStore', {
  state: () => {
    return {
      items: [] as Array<Banner>
    }
  },
  actions: {
    list(banners: Array<Banner>) {
      this.items = banners
    },
    edit(banner: Banner) {
      this.items = this.items.map((p) => {
        return p.uuid === banner.uuid ? banner : p
      })
    },
    delete(banner: Banner) {
      this.items.sort(sortByOrder)
      const index = this.items.findIndex((b) => b.uuid === banner.uuid)
      this.items.splice(index, 1)
      this.items.forEach((b, i) => {
        b.order = i
      })
    }
  }
})
