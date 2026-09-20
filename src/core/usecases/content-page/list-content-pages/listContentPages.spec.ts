import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { ContentPage } from '@core/entities/contentPage'
import { listContentPages } from '@core/usecases/content-page/list-content-pages/listContentPages'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content pages listing', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway()
    contentPageStore = useContentPageStore()
  })

  describe('There are content pages', () => {
    beforeEach(async () => {
      givenExistingContentPages(cgvContentPage, pharmacieContentPage)
      await whenListContentPages()
    })

    it('should store all content pages', () => {
      expect(
        contentPageStore.items.map((i: { slug: string }) => i.slug)
      ).toStrictEqual([cgvContentPage.slug, pharmacieContentPage.slug])
    })
  })

  describe('Listing is in progress', () => {
    it('should stop loading once done', async () => {
      givenExistingContentPages(cgvContentPage)
      await whenListContentPages()
      expect(contentPageStore.isLoading).toBe(false)
    })
  })

  const givenExistingContentPages = (...contentPages: Array<ContentPage>) => {
    contentPageGateway.feedWith(...contentPages)
  }

  const whenListContentPages = async () => {
    await listContentPages(contentPageGateway)
  }
})
