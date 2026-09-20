import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { ContentPage, ContentPageSlug } from '@core/entities/contentPage'
import { getContentPage } from '@core/usecases/content-page/content-page-get/getContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page get', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway()
    contentPageStore = useContentPageStore()
  })

  describe('The content page exists', () => {
    beforeEach(async () => {
      givenExistingContentPages(cgvContentPage, pharmacieContentPage)
      await whenGetContentPage(ContentPageSlug.PHARMACIE)
    })

    it('should set it as the current content page', () => {
      expect(contentPageStore.current).toStrictEqual(pharmacieContentPage)
    })
  })

  describe('The content page does not exist', () => {
    it('should throw ContentPageDoesNotExistsError', async () => {
      givenExistingContentPages(cgvContentPage)
      await expect(
        whenGetContentPage(ContentPageSlug.PHARMACIE)
      ).rejects.toThrow('Content page pharmacie does not exists')
    })
  })

  const givenExistingContentPages = (...contentPages: Array<ContentPage>) => {
    contentPageGateway.feedWith(...contentPages)
  }

  const whenGetContentPage = async (slug: ContentPageSlug) => {
    await getContentPage(slug, contentPageGateway)
  }
})
