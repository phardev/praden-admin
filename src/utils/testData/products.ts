import { Product, ProductStatus } from '@core/entities/product'
import { baby, dents, diarrhee, minceur } from '@utils/testData/categories'
import {
  anaca3,
  biocodex,
  boiron,
  gilbert,
  nutrisante,
  sanofiAventis
} from '@utils/testData/laboratories'
import { reserve, zoneGeo } from '@utils/testData/locations'

export const dolodent: Product = {
  uuid: 'product-dolodent',
  status: ProductStatus.Active,
  name: 'Dolodent solution 27g',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_195_1.jpg',
  images: [
    'https://www.pharmacieagnespraden.com/52664-large_default/dolodent-solution-gingivale-27-g.jpg'
  ],
  categories: [dents],
  cip7: '3400921',
  cip13: 'cip13-3400921929201',
  ean13: '3400921929201',
  priceWithoutTax: 500,
  percentTaxRate: 10,
  locations: { [zoneGeo.uuid]: 'DD02' },
  availableStock: 59,
  laboratory: gilbert,
  description: '<p>dolodent description</p>',
  instructionsForUse: '<p>dolodent instructions</p>',
  composition: '<p>dolodent composition</p>',
  weight: 980,
  isMedicine: true,

  flags: { arePromotionsAllowed: true }
}

export const ultraLevure: Product = {
  uuid: 'product-ultralevure',
  status: ProductStatus.Inactive,
  name: 'Ultra levure 200 mg 10 gélules',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_198_1.jpg?time=1675901328',
  images: [
    'https://www.pharmacieagnespraden.com/54697-large_default/ultra-levure-200-mg.jpg'
  ],
  categories: [diarrhee],
  cip7: '3400922',
  cip13: 'cip13-3400922096612',
  ean13: '3400922096612',
  priceWithoutTax: 432,
  percentTaxRate: 10,
  locations: { [zoneGeo.uuid]: 'C3', [reserve.uuid]: 'RESERVE_1' },
  availableStock: 36,
  laboratory: biocodex,
  description: '<p>ultralevure description</p>',
  instructionsForUse: '<p>ultralevure instructions</p>',
  composition: '<p>ultralevure composition</p>',
  weight: 12,
  maxQuantityForOrder: 6,
  isMedicine: true,
  flags: { arePromotionsAllowed: true }
}

export const anaca3Minceur: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-anaca3minceur',
  status: ProductStatus.Active,
  name: 'Anaca3 Perte de Poids Infusion 24 Sachets',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_198_1.jpg?time=1675901328',
  images: [
    'https://www.pharmacieagnespraden.com/72000-large_default/anaca-3-minc-infus-perte-poids-24sach.jpg'
  ],
  categories: [minceur],
  cip7: '3760007',
  cip13: 'cip13-3760007337185',
  ean13: '3760007337185',
  priceWithoutTax: 891,
  percentTaxRate: 5.5,
  locations: { [zoneGeo.uuid]: '1D450' },
  availableStock: 36,
  laboratory: anaca3,
  description: '<p>anaca3 description</p>',
  instructionsForUse: '<p>anaca3 instructions</p>',
  composition: '<p>anaca3 composition</p>',
  weight: 100,
  isMedicine: false
}

export const chamomilla: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-chamomilla',
  status: ProductStatus.Active,
  name: 'Chamomilla vulgaris 9CH suppositoires Boiron (poussée dentaire)',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_198_1.jpg?time=1675901328',
  images: [
    'https://www.pharmacieagnespraden.com/55-large_default/chamomilla-vulgaris-9-ch-boiron-12-suppositoires.jpg'
  ],
  categories: [dents],
  cip7: '3400921',
  cip13: 'cip13-3400921924008',
  ean13: '3400921924008',
  priceWithoutTax: 627,
  percentTaxRate: 10,
  locations: { [zoneGeo.uuid]: 'HOMEO-D' },
  availableStock: 1,
  laboratory: boiron,
  description: '<p>chamomilla description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 90,
  isMedicine: false
}

export const calmosine: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-calmosine',
  status: ProductStatus.Active,
  name: 'Calmosine 100 ml',
  images: [
    'https://www.pharmacieagnespraden.com/70697-home_default/calmosine-100ml.jpg'
  ],
  miniature: '',
  categories: [baby],
  cip7: '1234567',
  cip13: 'cip13-1234567890123',
  ean13: '1234567890123',
  priceWithoutTax: 810,
  percentTaxRate: 10,
  locations: { [zoneGeo.uuid]: 'E2' },
  availableStock: 10,
  laboratory: nutrisante,
  description: '<p>calmosine description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 250,
  isMedicine: false
}

export const hemoclar: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-hemoclar',
  status: ProductStatus.Active,
  name: 'Hemoclar 0,5% crème 30g',
  images: [
    'https://fakeimg.pl/300/',
    'https://fakeimg.pl/400/',
    'https://fakeimg.pl/300/'
  ],
  miniature: '',
  categories: [baby],
  cip7: '0987654',
  cip13: 'cip13-098765432123',
  ean13: '098765432123',
  priceWithoutTax: 590,
  percentTaxRate: 10,
  locations: { [zoneGeo.uuid]: 'D2' },
  availableStock: 23,
  laboratory: sanofiAventis,
  description: '<p>hemoclar description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 110,
  isMedicine: false
}

export const productWithoutLocation: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-withoutlocation',
  status: ProductStatus.Active,
  name: 'Product without location',
  images: ['https://fakeimg.pl/300/'],
  miniature: '',
  categories: [baby],
  cip7: '0637218',
  cip13: 'cip13-0637218312823',
  ean13: '0637218312823',
  priceWithoutTax: 590,
  percentTaxRate: 10,
  locations: {},
  availableStock: 23,
  laboratory: sanofiAventis,
  description: '<p>product without location description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 120,
  isMedicine: false
}

export const productWithoutCategory: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-withoutCategory',
  status: ProductStatus.Active,
  name: 'Product without category',
  images: ['https://fakeimg.pl/300/'],
  categories: [],
  miniature: '',
  cip7: '0637218',
  cip13: 'cip13-0637218312823',
  ean13: '0637218312823',
  priceWithoutTax: 590,
  percentTaxRate: 10,
  locations: {},
  availableStock: 23,
  laboratory: sanofiAventis,
  description: '<p>product without category description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 120,
  isMedicine: false
}

export const productWithoutLaboratory: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-withoutLaboratory',
  status: ProductStatus.Active,
  name: 'Product without laboratory',
  images: ['https://fakeimg.pl/300/'],
  categories: [baby],
  miniature: '',
  cip7: '0637218',
  cip13: 'cip13-0637218312823',
  ean13: '0637218312823',
  priceWithoutTax: 590,
  percentTaxRate: 10,
  locations: {},
  availableStock: 23,
  laboratory: null,
  description: '<p>product without laboratory description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 120,
  isMedicine: false
}

export const productWithDecimalPrice: Product = {
  flags: { arePromotionsAllowed: true },
  uuid: 'product-withDecimalPrice',
  status: ProductStatus.Active,
  name: 'Product with decimal price',
  images: ['https://fakeimg.pl/300/'],
  categories: [baby],
  miniature: '',
  cip7: '0637218',
  cip13: 'cip13-0637218312823',
  ean13: '0637218312823',
  priceWithoutTax: 332.5,
  percentTaxRate: 20,
  locations: {},
  availableStock: 23,
  laboratory: null,
  description: '<p>product with decimal price description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 120,
  isMedicine: false
}

export const productWithForbiddenPromotion: Product = {
  flags: { arePromotionsAllowed: false },
  uuid: 'product-withForbiddenPromotion',
  status: ProductStatus.Active,
  name: 'Product with forbidden promotion',
  images: ['https://fakeimg.pl/300/'],
  categories: [baby],
  miniature: '',
  cip7: '0637218',
  cip13: 'cip13-0637218312823',
  ean13: '0637218312823',
  priceWithoutTax: 332.5,
  percentTaxRate: 20,
  locations: {},
  availableStock: 23,
  laboratory: sanofiAventis,
  description: '<p>product with forbidden promotion description</p>',
  instructionsForUse: '<p>instructions</p>',
  composition: '<p>composition</p>',
  weight: 120,
  isMedicine: false
}
