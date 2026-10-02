import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { ContentPageStatus } from '@core/entities/contentPage'
import { getContentPage } from '@core/usecases/content-page/content-page-get/getContentPage'
import { unpublishContentPage } from '@core/usecases/content-page/content-page-publication/unpublishContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page unpublication', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway(new FakeDateProvider())
    contentPageGateway.feedWith(cgvContentPage, pharmacieContentPage)
    contentPageStore = useContentPageStore()
  })

  describe('The content page is not mandatory', () => {
    beforeEach(async () => {
      await getContentPage(pharmacieContentPage.slug, contentPageGateway)
      await unpublishContentPage(pharmacieContentPage.slug, contentPageGateway)
    })

    it('should unpublish it in the gateway', async () => {
      expect(
        await contentPageGateway.getBySlug(pharmacieContentPage.slug)
      ).toStrictEqual({
        ...pharmacieContentPage,
        status: ContentPageStatus.DRAFT
      })
    })

    it('should mark the current content page as a draft', () => {
      expect(contentPageStore.current).toStrictEqual({
        ...pharmacieContentPage,
        status: ContentPageStatus.DRAFT
      })
    })

    it('should stop saving once done', () => {
      expect(contentPageStore.isSaving).toBe(false)
    })
  })

  describe('The content page is mandatory', () => {
    beforeEach(async () => {
      await getContentPage(cgvContentPage.slug, contentPageGateway)
    })

    it('should report the error', async () => {
      await expect(
        unpublishContentPage(cgvContentPage.slug, contentPageGateway)
      ).rejects.toThrow('Content page cgv is mandatory')
    })

    it('should keep the current content page published', async () => {
      await unpublishContentPage(cgvContentPage.slug, contentPageGateway).catch(
        () => undefined
      )
      expect(contentPageStore.current).toStrictEqual(cgvContentPage)
    })
  })
})
