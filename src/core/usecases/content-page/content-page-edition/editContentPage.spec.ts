import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { ContentPage, ContentPageSlug } from '@core/entities/contentPage'
import { EditContentPageDTO } from '@core/gateways/contentPageGateway'
import { editContentPage } from '@core/usecases/content-page/content-page-edition/editContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page edition', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any
  let dto: EditContentPageDTO
  let expectedContentPage: ContentPage

  beforeEach(() => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway()
    contentPageStore = useContentPageStore()
  })

  describe('The content page exists', () => {
    beforeEach(async () => {
      givenExistingContentPages(cgvContentPage, pharmacieContentPage)
      dto = {
        title: 'Conditions Générales de Vente 2026',
        metaDescription: 'Les CGV mises à jour.',
        html: '<h2>Article 1</h2><p>Contenu mis à jour.</p>'
      }
      expectedContentPage = {
        ...cgvContentPage,
        ...dto
      }
      await whenEditContentPage(ContentPageSlug.CGV)
    })

    it('should update it in the gateway', async () => {
      expect(
        await contentPageGateway.getBySlug(ContentPageSlug.CGV)
      ).toStrictEqual(expectedContentPage)
    })

    it('should set it as the current content page', () => {
      expect(contentPageStore.current).toStrictEqual(expectedContentPage)
    })

    it('should stop saving once done', () => {
      expect(contentPageStore.isSaving).toBe(false)
    })
  })

  describe('The html contains an iframe and custom attributes', () => {
    it('should store it verbatim', async () => {
      givenExistingContentPages(cgvContentPage)
      const html =
        '<section data-tracking="cgv"><iframe src="https://maps.example/embed"></iframe></section>'
      dto = {
        title: 'Titre',
        metaDescription: 'Description',
        html
      }
      await whenEditContentPage(ContentPageSlug.CGV)
      expect(contentPageStore.current.html).toStrictEqual(html)
    })
  })

  const givenExistingContentPages = (...contentPages: Array<ContentPage>) => {
    contentPageGateway.feedWith(...contentPages)
  }

  const whenEditContentPage = async (slug: ContentPageSlug) => {
    await editContentPage(slug, dto, contentPageGateway)
  }
})
