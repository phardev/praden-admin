import {
  ContentPage,
  ContentPageListItem,
  ContentPageStatus
} from '@core/entities/contentPage'
import { FooterSection } from '@core/entities/footer'
import { defineStore } from 'pinia'

export const useContentPageStore = defineStore('ContentPageStore', {
  state: () => {
    return {
      items: [] as Array<ContentPageListItem>,
      current: undefined as ContentPage | undefined,
      isLoading: false,
      isSaving: false,
      isDeleting: false
    }
  },
  getters: {
    contentPage: (state) => state.current
  },
  actions: {
    list(contentPages: Array<ContentPageListItem>) {
      this.items = contentPages
    },
    setCurrent(contentPage: ContentPage) {
      this.current = JSON.parse(JSON.stringify(contentPage))
    },
    edit(contentPage: ContentPage) {
      this.setCurrent(contentPage)
    },
    remove(slug: string) {
      this.items = this.items.filter((item) => item.slug !== slug)
    },
    applyStatus(slug: string, status: ContentPageStatus) {
      if (this.current?.slug !== slug) return
      this.current = { ...this.current, status }
    },
    applyFooterSection(slug: string, footerSection?: FooterSection) {
      if (this.current?.slug !== slug) return
      this.current = JSON.parse(
        JSON.stringify({ ...this.current, footerSection })
      )
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    startSaving() {
      this.isSaving = true
    },
    stopSaving() {
      this.isSaving = false
    },
    startDeleting() {
      this.isDeleting = true
    },
    stopDeleting() {
      this.isDeleting = false
    }
  }
})
