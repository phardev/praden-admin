import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { Product } from '@core/entities/product'
import {
  anaca3Minceur,
  chamomilla,
  dolodent,
  ultraLevure
} from '@utils/testData/products'

const createPharmacistSelectionItem = (
  product: Product,
  price: number,
  order: number
): PharmacistSelection => {
  const item: PharmacistSelection = {
    uuid: product.uuid,
    name: product.name,
    miniature: product.miniature,
    priceWithoutTax: product.priceWithoutTax,
    percentTaxRate: product.percentTaxRate,
    price,
    availableStock: product.availableStock,
    weight: product.weight,
    laboratory: product.laboratory?.name,
    isMedicine: product.isMedicine,
    flags: product.flags,
    promotions: [],
    order
  }
  if (product.maxQuantityForOrder !== undefined) {
    item.maxQuantityForOrder = product.maxQuantityForOrder
  }
  return item
}

export const pharmacistSelection1: Array<PharmacistSelection> = [
  createPharmacistSelectionItem(dolodent, 550, 0),
  createPharmacistSelectionItem(ultraLevure, 475, 1),
  createPharmacistSelectionItem(anaca3Minceur, 940, 2),
  createPharmacistSelectionItem(chamomilla, 690, 3)
]

export const pharmacistSelection2: Array<PharmacistSelection> = [
  createPharmacistSelectionItem(dolodent, 550, 0),
  createPharmacistSelectionItem(chamomilla, 690, 1)
]

export const emptyPharmacistSelection: Array<PharmacistSelection> = []
