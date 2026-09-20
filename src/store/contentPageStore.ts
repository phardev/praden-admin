import { ContentPage, ContentPageListItem } from '@core/entities/contentPage'
import { defineStore } from 'pinia'

export const useContentPageStore = defineStore('ContentPageStore', {
  state: () => {
    return {
      items: [] as Array<ContentPageListItem>,
      current: undefined as ContentPage | undefined,
      isLoading: false,
      isSaving: false
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
    }
  }
})
