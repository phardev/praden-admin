import type {
  AssistanceRequest,
  AssistanceRequestDetails
} from '@core/entities/assistanceRequest'
import type { HashTable } from '@core/types/types'
import { defineStore } from 'pinia'

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const useAssistanceRequestStore = defineStore('AssistanceRequestStore', {
  state: () => {
    return {
      items: [] as Array<AssistanceRequest>,
      current: undefined as AssistanceRequestDetails | undefined,
      lastCreated: undefined as AssistanceRequest | undefined,
      attachmentUrls: {} as HashTable<string>,
      isLoading: false,
      isLoadingCurrent: false
    }
  },
  getters: {
    getById: (state) => {
      return (id: string): AssistanceRequest | undefined => {
        return state.items.find((item) => item.id === id)
      }
    }
  },
  actions: {
    setItems(items: Array<AssistanceRequest>) {
      this.items = items
    },
    setCurrent(details: AssistanceRequestDetails) {
      this.current = deepClone(details)
    },
    requestCreated(item: AssistanceRequest) {
      const created = deepClone(item)
      this.items.unshift(created)
      this.lastCreated = created
    },
    setAttachmentUrl(attachmentId: string, url: string) {
      this.attachmentUrls[attachmentId] = url
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    startLoadingCurrent() {
      this.isLoadingCurrent = true
    },
    stopLoadingCurrent() {
      this.isLoadingCurrent = false
    }
  }
})
