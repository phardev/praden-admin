import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent,
  hemoclar,
  productWithForbiddenPromotion,
  productWithoutCategory,
  productWithoutLaboratory,
  ultraLevure
} from '@utils/testData/products'

export const dolodentListItem: ProductListItem = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  ean13: dolodent.ean13,
  laboratory: dolodent.laboratory
    ? {
        uuid: dolodent.laboratory.uuid,
        name: dolodent.laboratory.name
      }
    : undefined,
  categories: dolodent.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: dolodent.priceWithoutTax,
  percentTaxRate: dolodent.percentTaxRate,
  availableStock: dolodent.availableStock,
  status: dolodent.status,
  flags: dolodent.flags,
  miniature: dolodent.miniature,
  isMedicine: dolodent.isMedicine
}

export const ultraLevureListItem: ProductListItem = {
  uuid: ultraLevure.uuid,
  name: ultraLevure.name,
  ean13: ultraLevure.ean13,
  laboratory: ultraLevure.laboratory
    ? {
        uuid: ultraLevure.laboratory.uuid,
        name: ultraLevure.laboratory.name
      }
    : undefined,
  categories: ultraLevure.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: ultraLevure.priceWithoutTax,
  percentTaxRate: ultraLevure.percentTaxRate,
  availableStock: ultraLevure.availableStock,
  status: ultraLevure.status,
  flags: ultraLevure.flags,
  miniature: ultraLevure.miniature,
  isMedicine: ultraLevure.isMedicine
}

export const anaca3MinceurListItem: ProductListItem = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  ean13: anaca3Minceur.ean13,
  laboratory: anaca3Minceur.laboratory
    ? {
        uuid: anaca3Minceur.laboratory.uuid,
        name: anaca3Minceur.laboratory.name
      }
    : undefined,
  categories: anaca3Minceur.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: anaca3Minceur.priceWithoutTax,
  percentTaxRate: anaca3Minceur.percentTaxRate,
  availableStock: anaca3Minceur.availableStock,
  status: anaca3Minceur.status,
  flags: anaca3Minceur.flags,
  miniature: anaca3Minceur.miniature,
  isMedicine: anaca3Minceur.isMedicine
}

export const chamomillaListItem: ProductListItem = {
  uuid: chamomilla.uuid,
  name: chamomilla.name,
  ean13: chamomilla.ean13,
  laboratory: chamomilla.laboratory
    ? {
        uuid: chamomilla.laboratory.uuid,
        name: chamomilla.laboratory.name
      }
    : undefined,
  categories: chamomilla.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: chamomilla.priceWithoutTax,
  percentTaxRate: chamomilla.percentTaxRate,
  availableStock: chamomilla.availableStock,
  status: chamomilla.status,
  flags: chamomilla.flags,
  miniature: chamomilla.miniature,
  isMedicine: chamomilla.isMedicine
}

export const calmosineListItem: ProductListItem = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  ean13: calmosine.ean13,
  laboratory: calmosine.laboratory
    ? {
        uuid: calmosine.laboratory.uuid,
        name: calmosine.laboratory.name
      }
    : undefined,
  categories: calmosine.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: calmosine.priceWithoutTax,
  percentTaxRate: calmosine.percentTaxRate,
  availableStock: calmosine.availableStock,
  status: calmosine.status,
  flags: calmosine.flags,
  miniature: calmosine.miniature,
  isMedicine: calmosine.isMedicine
}

export const hemoclarListItem: ProductListItem = {
  uuid: hemoclar.uuid,
  name: hemoclar.name,
  ean13: hemoclar.ean13,
  laboratory: hemoclar.laboratory
    ? {
        uuid: hemoclar.laboratory.uuid,
        name: hemoclar.laboratory.name
      }
    : undefined,
  categories: hemoclar.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: hemoclar.priceWithoutTax,
  percentTaxRate: hemoclar.percentTaxRate,
  availableStock: hemoclar.availableStock,
  status: hemoclar.status,
  flags: hemoclar.flags,
  miniature: hemoclar.miniature,
  isMedicine: hemoclar.isMedicine
}

export const productWithoutCategoryListItem: ProductListItem = {
  uuid: productWithoutCategory.uuid,
  name: productWithoutCategory.name,
  ean13: productWithoutCategory.ean13,
  laboratory: productWithoutCategory.laboratory
    ? {
        uuid: productWithoutCategory.laboratory.uuid,
        name: productWithoutCategory.laboratory.name
      }
    : undefined,
  categories: [],
  priceWithoutTax: productWithoutCategory.priceWithoutTax,
  percentTaxRate: productWithoutCategory.percentTaxRate,
  availableStock: productWithoutCategory.availableStock,
  status: productWithoutCategory.status,
  flags: productWithoutCategory.flags,
  miniature: productWithoutCategory.miniature,
  isMedicine: productWithoutCategory.isMedicine
}

export const productWithoutLaboratoryListItem: ProductListItem = {
  uuid: productWithoutLaboratory.uuid,
  name: productWithoutLaboratory.name,
  ean13: productWithoutLaboratory.ean13,
  laboratory: undefined,
  categories: productWithoutLaboratory.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: productWithoutLaboratory.priceWithoutTax,
  percentTaxRate: productWithoutLaboratory.percentTaxRate,
  availableStock: productWithoutLaboratory.availableStock,
  status: productWithoutLaboratory.status,
  flags: productWithoutLaboratory.flags,
  miniature: productWithoutLaboratory.miniature,
  isMedicine: productWithoutLaboratory.isMedicine
}

export const productWithForbiddenPromotionListItem: ProductListItem = {
  uuid: productWithForbiddenPromotion.uuid,
  name: productWithForbiddenPromotion.name,
  ean13: productWithForbiddenPromotion.ean13,
  laboratory: productWithForbiddenPromotion.laboratory
    ? {
        uuid: productWithForbiddenPromotion.laboratory.uuid,
        name: productWithForbiddenPromotion.laboratory.name
      }
    : undefined,
  categories: productWithForbiddenPromotion.categories.map((c) => ({
    uuid: c.uuid,
    name: c.name
  })),
  priceWithoutTax: productWithForbiddenPromotion.priceWithoutTax,
  percentTaxRate: productWithForbiddenPromotion.percentTaxRate,
  availableStock: productWithForbiddenPromotion.availableStock,
  status: productWithForbiddenPromotion.status,
  flags: productWithForbiddenPromotion.flags,
  miniature: productWithForbiddenPromotion.miniature,
  isMedicine: productWithForbiddenPromotion.isMedicine
}
