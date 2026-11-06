import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { HomepageShowcaseGateway } from '@core/gateways/homepageShowcaseGateway'
import { useHomepageShowcaseStore } from '@store/homepageShowcaseStore'

export const updateHomepageShowcase = async (
  kind: ShowcaseKind,
  products: Array<ShowcaseProduct>,
  homepageShowcaseGateway: HomepageShowcaseGateway
): Promise<void> => {
  const homepageShowcaseStore = useHomepageShowcaseStore()
  try {
    homepageShowcaseStore.startLoading()
    await homepageShowcaseGateway.update(kind, products)
    homepageShowcaseStore.setShowcase(kind, products)
    homepageShowcaseStore.stopLoading()
  } catch (error) {
    homepageShowcaseStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
