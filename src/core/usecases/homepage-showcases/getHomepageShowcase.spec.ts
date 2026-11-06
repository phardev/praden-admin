import { InMemoryHomepageShowcaseGateway } from '@adapters/secondary/homepage-showcase-gateways/inMemoryHomepageShowcaseGateway'
import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { getHomepageShowcase } from '@core/usecases/homepage-showcases/getHomepageShowcase'
import { useHomepageShowcaseStore } from '@store/homepageShowcaseStore'
import { showcase1, showcase2 } from '@utils/testData/homepageShowcases'
import { createPinia, setActivePinia } from 'pinia'

describe('Homepage showcase get', () => {
  const kind = ShowcaseKind.HomepagePromotions
  let homepageShowcaseStore: ReturnType<typeof useHomepageShowcaseStore>
  let homepageShowcaseGateway: InMemoryHomepageShowcaseGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    homepageShowcaseStore = useHomepageShowcaseStore()
    homepageShowcaseGateway = new InMemoryHomepageShowcaseGateway()
  })

  it('should save the showcase in the store', async () => {
    givenExistingShowcase(kind, showcase1)
    await whenGetHomepageShowcase(kind)
    expect(homepageShowcaseStore.get(kind)).toStrictEqual(showcase1)
  })

  it('should keep the other showcase apart', async () => {
    givenExistingShowcase(ShowcaseKind.PharmacistSelection, showcase2)
    givenExistingShowcase(kind, showcase1)
    await whenGetHomepageShowcase(ShowcaseKind.PharmacistSelection)
    await whenGetHomepageShowcase(kind)
    expect(
      homepageShowcaseStore.get(ShowcaseKind.PharmacistSelection)
    ).toStrictEqual(showcase2)
  })

  it('should set loading to true at start of getting the showcase', () => {
    givenExistingShowcase(kind, showcase1)
    const promise = whenGetHomepageShowcase(kind)
    expect(homepageShowcaseStore.isLoading).toBe(true)
    return promise
  })

  it('should set loading to false after getting the showcase', async () => {
    givenExistingShowcase(kind, showcase1)
    await whenGetHomepageShowcase(kind)
    expect(homepageShowcaseStore.isLoading).toBe(false)
  })

  it('should set error when gateway fails', async () => {
    homepageShowcaseGateway.feedWithError(new Error('Failed to fetch showcase'))
    await whenGetHomepageShowcase(kind)
    expect(homepageShowcaseStore.error).toBe('Failed to fetch showcase')
  })

  it('should set loading to false when gateway fails', async () => {
    homepageShowcaseGateway.feedWithError(new Error('Failed to fetch showcase'))
    await whenGetHomepageShowcase(kind)
    expect(homepageShowcaseStore.isLoading).toBe(false)
  })

  const givenExistingShowcase = (
    showcaseKind: ShowcaseKind,
    products: Array<ShowcaseProduct>
  ) => {
    homepageShowcaseGateway.feedWith(showcaseKind, ...products)
  }

  const whenGetHomepageShowcase = async (showcaseKind: ShowcaseKind) => {
    await getHomepageShowcase(showcaseKind, homepageShowcaseGateway)
  }
})
