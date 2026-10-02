import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import type { NewsletterUnsubscriptionImport } from '@core/entities/newsletterUnsubscriptionImport'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useNewsletterStore = defineStore('NewsletterSubcriptionStore', {
  state: () => {
    return {
      items: [] as Array<NewsletterSubscription>,
      isLoading: false,
      unsubscriptionImport: undefined as
        | NewsletterUnsubscriptionImport
        | undefined
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
    },
    setUnsubscriptionImport(
      unsubscriptionImport: NewsletterUnsubscriptionImport
    ) {
      this.unsubscriptionImport = unsubscriptionImport
    },
    selectUnsubscriptionColumn(position: number) {
      if (!this.unsubscriptionImport) return
      this.unsubscriptionImport.selectedPosition = position
    },
    startUnsubscribing(submittedCount: number) {
      if (!this.unsubscriptionImport) return
      this.unsubscriptionImport.isUnsubscribing = true
      this.unsubscriptionImport.progress = {
        submittedCount,
        processedCount: 0,
        unsubscribedCount: 0
      }
    },
    addUnsubscriptionProgress(
      processedCount: number,
      unsubscribedCount: number
    ) {
      const progress = this.unsubscriptionImport?.progress
      if (!progress) return
      progress.processedCount += processedCount
      progress.unsubscribedCount += unsubscribedCount
    },
    stopUnsubscribing() {
      if (!this.unsubscriptionImport) return
      this.unsubscriptionImport.isUnsubscribing = false
    },
    clearUnsubscriptionImport() {
      this.unsubscriptionImport = undefined
    }
  }
})
