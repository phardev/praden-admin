import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { ContentPageStatus } from '@core/entities/contentPage'
import { getContentPage } from '@core/usecases/content-page/content-page-get/getContentPage'
import { publishContentPage } from '@core/usecases/content-page/content-page-publication/publishContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { deliveryContentPage } from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page publication', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway(new FakeDateProvider())
    contentPageGateway.feedWith(deliveryContentPage)
    contentPageStore = useContentPageStore()
    await getContentPage(deliveryContentPage.slug, contentPageGateway)
    await publishContentPage(deliveryContentPage.slug, contentPageGateway)
  })

  it('should publish it in the gateway', async () => {
    expect(
      await contentPageGateway.getBySlug(deliveryContentPage.slug)
    ).toStrictEqual({
      ...deliveryContentPage,
      status: ContentPageStatus.PUBLISHED
    })
  })

  it('should mark the current content page as published', () => {
    expect(contentPageStore.current).toStrictEqual({
      ...deliveryContentPage,
      status: ContentPageStatus.PUBLISHED
    })
  })

  it('should stop saving once done', () => {
    expect(contentPageStore.isSaving).toBe(false)
  })
})
