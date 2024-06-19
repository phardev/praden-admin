import { anaca3Minceur, dolodent, ultraLevure } from '@utils/testData/products'
import { Promotion, ReductionType } from '@core/entities/promotion'

export const promotionPercentageDolodent: Promotion = {
  uuid: 'promotion-dolodent',
  name: 'Promotion en pourcentage sur le dolodent',
  products: [dolodent.uuid],
  type: ReductionType.Percentage,
  amount: 10,
  startDate: 1690416000000,
  endDate: 1693094400000
}

export const promotionFixedMultipleProducts: Promotion = {
  uuid: 'promotion-multiple-products',
  name: 'Promotion fixe sur de multiples produits',
  products: [ultraLevure.uuid, anaca3Minceur.uuid],
  type: ReductionType.Fixed,
  amount: 100,
  startDate: 1690416000000,
  endDate: 1693094400000
}
