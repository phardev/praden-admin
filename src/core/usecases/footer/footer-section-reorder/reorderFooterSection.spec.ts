import { InMemoryFooterGateway } from '@adapters/secondary/footer-gateways/inMemoryFooterGateway'
import { Footer, FooterSection } from '@core/entities/footer'
import { reorderFooterSection } from '@core/usecases/footer/footer-section-reorder/reorderFooterSection'
import { getFooter } from '@core/usecases/footer/get-footer/getFooter'
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

describe('Footer section reorder', () => {
  let footerGateway: InMemoryFooterGateway
  let footerStore: any
  let expectedFooter: Footer

  beforeEach(async () => {
    setActivePinia(createPinia())
    footerGateway = new InMemoryFooterGateway()
    footerGateway.feedWith(footer)
    footerStore = useFooterStore()
    await getFooter(footerGateway)
    expectedFooter = {
      sections: [
        {
          section: FooterSection.PHARMACY,
          entries: [
            deliveryFooterEntry,
            pharmacieFooterEntry,
            contactFooterEntry
          ]
        },
        {
          section: FooterSection.LEGAL,
          entries: [cgvFooterEntry, cookieSettingsFooterEntry]
        }
      ]
    }
    await reorderFooterSection(
      FooterSection.PHARMACY,
      [
        deliveryFooterEntry.uuid,
        pharmacieFooterEntry.uuid,
        contactFooterEntry.uuid
      ],
      footerGateway
    )
  })

  it('should reorder the section in the gateway', async () => {
    expect(await footerGateway.get()).toStrictEqual(expectedFooter)
  })

  it('should reorder the section in the store', () => {
    expect(footerStore.footer).toStrictEqual(expectedFooter)
  })

  it('should stop saving once done', () => {
    expect(footerStore.isSaving).toBe(false)
  })
})
