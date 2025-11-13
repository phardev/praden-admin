import { InMemoryPromotionGateway } from '@adapters/secondary/promotion-gateways/InMemoryPromotionGateway'
import { RealPromotionGateway } from '@adapters/secondary/promotion-gateways/RealPromotionGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as promotionsListItems from '@utils/testData/fixtures/promotions/promotionListItems'
import * as promotionStats from '@utils/testData/promotionStats'
import * as promotions from '@utils/testData/promotions'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('abc123')
const promotionGateway = new InMemoryPromotionGateway(uuidGenerator)
promotionGateway.feedWith(...Object.values(promotions))
promotionGateway.feedListItemWith(...Object.values(promotionsListItems))
promotionGateway.feedStatsFor(
  'promotion-dolodent',
  promotionStats.dolodentPromotionStats
)
promotionGateway.feedStatsFor(
  'promotion-multiple-products',
  promotionStats.multipleProductsPromotionStats
)

const dolodentPdfBlob = new Blob(
  ['%PDF-1.4 Fake PDF for Dolodent promotion statistics'],
  { type: 'application/pdf' }
)
const multipleProductsPdfBlob = new Blob(
  ['%PDF-1.4 Fake PDF for Multiple Products promotion statistics'],
  { type: 'application/pdf' }
)
promotionGateway.feedPDFBlobFor('promotion-dolodent', dolodentPdfBlob)
promotionGateway.feedPDFBlobFor(
  'promotion-multiple-products',
  multipleProductsPdfBlob
)

export const usePromotionGateway = () => {
  if (isLocalEnv()) {
    return promotionGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealPromotionGateway(BACKEND_URL)
}
