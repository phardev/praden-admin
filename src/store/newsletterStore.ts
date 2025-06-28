import { defineStore } from 'pinia'
import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { UUID } from '@core/types/types'

export const useNewsletterStore = defineStore('NewsletterSubcriptionStore', {
  state: () => {
    return {
      items: [] as Array<NewsletterSubscription>,
      isLoading: false
    }
  },
  actions: {
    add(subscription: NewsletterSubscription) {
      this.items.push(subscription)
    },
    remove(uuid: UUID) {
      this.items = this.items.filter((s) => s.uuid !== uuid)
    },
    list(subscriptions: Array<NewsletterSubscription>) {
      this.items = subscriptions
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
