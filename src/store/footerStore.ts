import { Footer, FooterSection } from '@core/entities/footer'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useFooterStore = defineStore('FooterStore', {
  state: () => {
    return {
      footer: { sections: [] } as Footer,
      isLoading: false,
      isSaving: false
    }
  },
  actions: {
    set(footer: Footer) {
      this.footer = JSON.parse(JSON.stringify(footer))
    },
    reorderSection(section: FooterSection, uuids: Array<UUID>) {
      this.footer = {
        sections: this.footer.sections.map((current) =>
          current.section === section
            ? {
                ...current,
                entries: [...current.entries].sort(
                  (a, b) => uuids.indexOf(a.uuid) - uuids.indexOf(b.uuid)
                )
              }
            : current
        )
      }
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
