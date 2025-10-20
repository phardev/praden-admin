import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'

export const promotionPercentageDolodentListItem: PromotionListItem = {
  uuid: promotionPercentageDolodent.uuid,
  name: promotionPercentageDolodent.name,
  type: promotionPercentageDolodent.type,
  amount: promotionPercentageDolodent.amount,
  startDate: promotionPercentageDolodent.startDate,
  endDate: promotionPercentageDolodent.endDate,
  productCount: promotionPercentageDolodent.products.length
}

export const promotionFixedMultipleProductsListItem: PromotionListItem = {
  uuid: promotionFixedMultipleProducts.uuid,
  name: promotionFixedMultipleProducts.name,
  type: promotionFixedMultipleProducts.type,
  amount: promotionFixedMultipleProducts.amount,
  startDate: promotionFixedMultipleProducts.startDate,
  endDate: promotionFixedMultipleProducts.endDate,
  productCount: promotionFixedMultipleProducts.products.length
}
