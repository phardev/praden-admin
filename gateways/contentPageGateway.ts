import { InMemoryContentPageGateway } from '@adapters/secondary/content-page-gateways/inMemoryContentPageGateway'
import { RealContentPageGateway } from '@adapters/secondary/content-page-gateways/realContentPageGateway'
import { isLocalEnv } from '@utils/env'
import {
  articleContentPage,
  cgvContentPage,
  confidentialiteContentPage,
  engagementContentPage,
  mentionsLegalesContentPage,
  paiementContentPage,
  pharmacieContentPage,
  recrutementContentPage
} from '@utils/testData/contentPages'

const contentPageGateway = new InMemoryContentPageGateway()
contentPageGateway.feedWith(
  cgvContentPage,
  mentionsLegalesContentPage,
  confidentialiteContentPage,
  paiementContentPage,
  pharmacieContentPage,
  engagementContentPage,
  recrutementContentPage,
  articleContentPage
)

export const useContentPageGateway = () => {
  if (isLocalEnv()) {
    return contentPageGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealContentPageGateway(BACKEND_URL)
}
