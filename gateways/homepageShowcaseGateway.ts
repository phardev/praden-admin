import { InMemoryHomepageShowcaseGateway } from '@adapters/secondary/homepage-showcase-gateways/inMemoryHomepageShowcaseGateway'
import { RealHomepageShowcaseGateway } from '@adapters/secondary/homepage-showcase-gateways/realHomepageShowcaseGateway'
import { ShowcaseKind } from '@core/entities/homepageShowcase'
import { isLocalEnv } from '@utils/env'
import { showcase1 } from '@utils/testData/homepageShowcases'

const homepageShowcaseGateway = new InMemoryHomepageShowcaseGateway()
homepageShowcaseGateway.feedWith(ShowcaseKind.PharmacistSelection, ...showcase1)

export const useHomepageShowcaseGateway = () => {
  if (isLocalEnv()) {
    return homepageShowcaseGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealHomepageShowcaseGateway(BACKEND_URL)
}
