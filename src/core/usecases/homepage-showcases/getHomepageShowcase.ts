import { ShowcaseKind } from '@core/entities/homepageShowcase'
import { HomepageShowcaseGateway } from '@core/gateways/homepageShowcaseGateway'
import { useHomepageShowcaseStore } from '@store/homepageShowcaseStore'

export const getHomepageShowcase = async (
  kind: ShowcaseKind,
  homepageShowcaseGateway: HomepageShowcaseGateway
): Promise<void> => {
  const homepageShowcaseStore = useHomepageShowcaseStore()
  try {
    homepageShowcaseStore.startLoading()
    const products = await homepageShowcaseGateway.get(kind)
    homepageShowcaseStore.setShowcase(kind, products)
    homepageShowcaseStore.stopLoading()
  } catch (error) {
    homepageShowcaseStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
