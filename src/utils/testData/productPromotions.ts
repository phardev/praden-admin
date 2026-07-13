import { ProductPromotion, ReductionType } from '@core/entities/promotion'

export const productPromotionPercentage: ProductPromotion = {
  uuid: 'product-promotion-percentage',
  name: 'Promotion produit en pourcentage',
  type: ReductionType.Percentage,
  amount: 10,
  startDate: 1690416000000,
  endDate: 1693094400000,
  createdAt: 1690000000000
}

export const productPromotionFixed: ProductPromotion = {
  uuid: 'product-promotion-fixed',
  name: 'Promotion produit fixe',
  type: ReductionType.Fixed,
  amount: 110,
  startDate: 1690416000000,
  endDate: 1693094400000,
  createdAt: 1690001000000
}

export const productPromotionWin: ProductPromotion = {
  uuid: 'product-promotion-win',
  name: 'WIN',
  type: ReductionType.Percentage,
  amount: 5,
  createdAt: 1690002000000
}
