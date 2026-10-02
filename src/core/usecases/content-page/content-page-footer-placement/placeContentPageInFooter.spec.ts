import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FooterSection } from '@core/entities/footer'
import { placeContentPageInFooter } from '@core/usecases/content-page/content-page-footer-placement/placeContentPageInFooter'
import { getContentPage } from '@core/usecases/content-page/content-page-get/getContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { deliveryContentPage } from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page footer placement', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    contentPageGateway = new InMemoryContentPageGateway(new FakeDateProvider())
    contentPageGateway.feedWith(deliveryContentPage)
    contentPageStore = useContentPageStore()
    await getContentPage(deliveryContentPage.slug, contentPageGateway)
    await placeContentPageInFooter(
      deliveryContentPage.slug,
      FooterSection.LEGAL,
      contentPageGateway
    )
  })

  it('should place it in the footer section in the gateway', async () => {
    expect(
      await contentPageGateway.getBySlug(deliveryContentPage.slug)
    ).toStrictEqual({
      ...deliveryContentPage,
      footerSection: FooterSection.LEGAL
    })
  })

  it('should set the footer section of the current content page', () => {
    expect(contentPageStore.current).toStrictEqual({
      ...deliveryContentPage,
      footerSection: FooterSection.LEGAL
    })
  })

  it('should stop saving once done', () => {
    expect(contentPageStore.isSaving).toBe(false)
  })
})
