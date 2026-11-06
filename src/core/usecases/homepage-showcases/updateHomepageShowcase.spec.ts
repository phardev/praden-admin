import { InMemoryHomepageShowcaseGateway } from '@adapters/secondary/homepage-showcase-gateways/inMemoryHomepageShowcaseGateway'
import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { updateHomepageShowcase } from '@core/usecases/homepage-showcases/updateHomepageShowcase'
import { useHomepageShowcaseStore } from '@store/homepageShowcaseStore'
import { showcase1, showcase2 } from '@utils/testData/homepageShowcases'
import { createPinia, setActivePinia } from 'pinia'

describe('Homepage showcase update', () => {
  const kind = ShowcaseKind.HomepagePromotions
  let homepageShowcaseStore: ReturnType<typeof useHomepageShowcaseStore>
  let homepageShowcaseGateway: InMemoryHomepageShowcaseGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    homepageShowcaseStore = useHomepageShowcaseStore()
    homepageShowcaseGateway = new InMemoryHomepageShowcaseGateway()
    homepageShowcaseGateway.feedWith(kind, ...showcase1)
  })

  it('should save the showcase in the gateway', async () => {
    await whenUpdateHomepageShowcase(showcase2)
    expect(await homepageShowcaseGateway.get(kind)).toStrictEqual(showcase2)
  })

  it('should update the showcase in store with the new order', async () => {
    const reordered = [showcase1[2], showcase1[0], showcase1[1]]
    await whenUpdateHomepageShowcase(reordered)
    expect(homepageShowcaseStore.get(kind)).toStrictEqual(reordered)
  })

  it('should set loading to true at start of update', () => {
    const promise = whenUpdateHomepageShowcase(showcase2)
    expect(homepageShowcaseStore.isLoading).toBe(true)
    return promise
  })

  it('should set loading to false after update', async () => {
    await whenUpdateHomepageShowcase(showcase2)
    expect(homepageShowcaseStore.isLoading).toBe(false)
  })

  it('should set error when gateway fails', async () => {
    homepageShowcaseGateway.feedWithError(
      new Error('Failed to update showcase')
    )
    await whenUpdateHomepageShowcase(showcase2)
    expect(homepageShowcaseStore.error).toBe('Failed to update showcase')
  })

  it('should set loading to false when gateway fails', async () => {
    homepageShowcaseGateway.feedWithError(
      new Error('Failed to update showcase')
    )
    await whenUpdateHomepageShowcase(showcase2)
    expect(homepageShowcaseStore.isLoading).toBe(false)
  })

  const whenUpdateHomepageShowcase = async (
    products: Array<ShowcaseProduct>
  ) => {
    await updateHomepageShowcase(kind, products, homepageShowcaseGateway)
  }
})
