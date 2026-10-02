import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { deleteContentPage } from '@core/usecases/content-page/content-page-deletion/deleteContentPage'
import { listContentPages } from '@core/usecases/content-page/list-content-pages/listContentPages'
import { useContentPageStore } from '@store/contentPageStore'
import {
  cgvContentPage,
  deliveryContentPage,
  pharmacieContentPage
} from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page deletion', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway(new FakeDateProvider())
    contentPageGateway.feedWith(
      cgvContentPage,
      pharmacieContentPage,
      deliveryContentPage
    )
    contentPageStore = useContentPageStore()
    await listContentPages(contentPageGateway)
  })

  describe('The content page can be deleted', () => {
    beforeEach(async () => {
      await whenDeleteContentPage(pharmacieContentPage.slug)
    })

    it('should delete it from the gateway', async () => {
      await expect(
        contentPageGateway.getBySlug(pharmacieContentPage.slug)
      ).rejects.toThrow('Content page pharmacie does not exists')
    })

    it('should remove it from the list', () => {
      expect(
        contentPageStore.items.map((i: { slug: string }) => i.slug)
      ).toStrictEqual([cgvContentPage.slug, deliveryContentPage.slug])
    })

    it('should stop deleting once done', () => {
      expect(contentPageStore.isDeleting).toBe(false)
    })
  })

  describe('The content page is mandatory', () => {
    it('should report the error', async () => {
      await expect(whenDeleteContentPage(cgvContentPage.slug)).rejects.toThrow(
        'Content page cgv is mandatory'
      )
    })

    it('should keep it in the list', async () => {
      await whenDeleteContentPage(cgvContentPage.slug).catch(() => undefined)
      expect(
        contentPageStore.items.map((i: { slug: string }) => i.slug)
      ).toStrictEqual([
        cgvContentPage.slug,
        pharmacieContentPage.slug,
        deliveryContentPage.slug
      ])
    })

    it('should stop deleting', async () => {
      await whenDeleteContentPage(cgvContentPage.slug).catch(() => undefined)
      expect(contentPageStore.isDeleting).toBe(false)
    })
  })

  const whenDeleteContentPage = async (slug: string) => {
    await deleteContentPage(slug, contentPageGateway)
  }
})
