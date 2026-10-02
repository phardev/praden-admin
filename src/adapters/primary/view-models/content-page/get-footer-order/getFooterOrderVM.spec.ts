import { getFooterOrderVM } from '@adapters/primary/view-models/content-page/get-footer-order/getFooterOrderVM'
import { FooterSection } from '@core/entities/footer'
import { useFooterStore } from '@store/footerStore'
import {
  cgvFooterEntry,
  contactFooterEntry,
  cookieSettingsFooterEntry,
  deliveryFooterEntry,
  footer,
  pharmacieFooterEntry
} from '@utils/testData/footer'
import { createPinia, setActivePinia } from 'pinia'

describe('Get footer order VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('The footer holds pages and system entries', () => {
    it('should return each section with its entries ready for display', () => {
      useFooterStore().set(footer)
      expect(getFooterOrderVM()).toStrictEqual({
        isLoading: false,
        isSaving: false,
        sections: [
          {
            section: FooterSection.PHARMACY,
            entries: [
              {
                uuid: pharmacieFooterEntry.uuid,
                isSystem: false,
                name: pharmacieFooterEntry.name,
                systemKey: '',
                isLocked: false,
                isDraft: false
              },
              {
                uuid: contactFooterEntry.uuid,
                isSystem: true,
                name: '',
                systemKey: contactFooterEntry.systemKey,
                isLocked: true,
                isDraft: false
              },
              {
                uuid: deliveryFooterEntry.uuid,
                isSystem: false,
                name: deliveryFooterEntry.name,
                systemKey: '',
                isLocked: false,
                isDraft: true
              }
            ]
          },
          {
            section: FooterSection.LEGAL,
            entries: [
              {
                uuid: cgvFooterEntry.uuid,
                isSystem: false,
                name: cgvFooterEntry.name,
                systemKey: '',
                isLocked: true,
                isDraft: false
              },
              {
                uuid: cookieSettingsFooterEntry.uuid,
                isSystem: true,
                name: '',
                systemKey: cookieSettingsFooterEntry.systemKey,
                isLocked: true,
                isDraft: false
              }
            ]
          }
        ]
      })
    })
  })

  describe('The footer is loading', () => {
    it('should expose the loading state', () => {
      useFooterStore().startLoading()
      expect(getFooterOrderVM().isLoading).toBe(true)
    })
  })

  describe('An order is being saved', () => {
    it('should expose the saving state', () => {
      useFooterStore().startSaving()
      expect(getFooterOrderVM().isSaving).toBe(true)
    })
  })
})
