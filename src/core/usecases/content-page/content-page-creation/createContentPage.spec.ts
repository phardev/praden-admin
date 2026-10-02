import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { ContentPage, ContentPageStatus } from '@core/entities/contentPage'
import { CreateContentPageDTO } from '@core/gateways/contentPageGateway'
import { createContentPage } from '@core/usecases/content-page/content-page-creation/createContentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { cgvContentPage } from '@utils/testData/contentPages'
import { createPinia, setActivePinia } from 'pinia'

describe('Content page creation', () => {
  let contentPageGateway: InMemoryContentPageGateway
  let contentPageStore: any
  let dateProvider: FakeDateProvider
  let dto: CreateContentPageDTO
  let expectedContentPage: ContentPage
  const now = 1735689600000

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(now)
    contentPageGateway = new InMemoryContentPageGateway(dateProvider)
    contentPageGateway.feedWith(cgvContentPage)
    contentPageStore = useContentPageStore()
    dto = {
      slug: 'livraison',
      name: 'Livraison',
      title: 'Modes et délais de livraison',
      metaDescription: 'Les modes et délais de livraison.',
      html: '<h1>Livraison</h1>'
    }
  })

  describe('The slug is free', () => {
    beforeEach(async () => {
      expectedContentPage = {
        ...dto,
        status: ContentPageStatus.DRAFT,
        isMandatory: false,
        updatedAt: now,
        updatedBy: 'staff-agnes'
      }
      await whenCreateContentPage()
    })

    it('should create it in the gateway as a draft', async () => {
      expect(await contentPageGateway.getBySlug(dto.slug)).toStrictEqual(
        expectedContentPage
      )
    })

    it('should set it as the current content page', () => {
      expect(contentPageStore.current).toStrictEqual(expectedContentPage)
    })

    it('should stop saving once done', () => {
      expect(contentPageStore.isSaving).toBe(false)
    })
  })

  describe('The slug is already used', () => {
    beforeEach(() => {
      dto = { ...dto, slug: cgvContentPage.slug }
    })

    it('should report the error', async () => {
      await expect(whenCreateContentPage()).rejects.toThrow(
        'Content page slug cgv already exists'
      )
    })

    it('should stop saving', async () => {
      await whenCreateContentPage().catch(() => undefined)
      expect(contentPageStore.isSaving).toBe(false)
    })
  })

  const whenCreateContentPage = async () => {
    await createContentPage(dto, contentPageGateway)
  }
})
