import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { ContentPage } from '@core/entities/contentPage'
import { removeContentPageFromFooter } from '@core/usecases/content-page/content-page-footer-placement/removeContentPageFromFooter'
import { getContentPage } from '@core/usecases/content-page/content-page-get/getContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page footer removal', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any
  let expectedContentPage: ContentPage

  beforeEach(() => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway(new FakeDateProvider())
    contentPageGateway.feedWith(cgvContentPage, pharmacieContentPage)
    contentPageStore = useContentPageStore()
  })

  describe('The content page is not mandatory', () => {
    beforeEach(async () => {
      expectedContentPage = JSON.parse(
        JSON.stringify({ ...pharmacieContentPage, footerSection: undefined })
      )
      await getContentPage(pharmacieContentPage.slug, contentPageGateway)
      await removeContentPageFromFooter(
        pharmacieContentPage.slug,
        contentPageGateway
      )
    })

    it('should remove it from the footer in the gateway', async () => {
      expect(
        await contentPageGateway.getBySlug(pharmacieContentPage.slug)
      ).toStrictEqual(expectedContentPage)
    })

    it('should clear the footer section of the current content page', () => {
      expect(contentPageStore.current).toStrictEqual(expectedContentPage)
    })

    it('should stop saving once done', () => {
      expect(contentPageStore.isSaving).toBe(false)
    })
  })

  describe('The content page is mandatory', () => {
    it('should report the error', async () => {
      await getContentPage(cgvContentPage.slug, contentPageGateway)
      await expect(
        removeContentPageFromFooter(cgvContentPage.slug, contentPageGateway)
      ).rejects.toThrow('Content page cgv is mandatory')
    })
  })
})
