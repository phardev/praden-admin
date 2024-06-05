import { Product } from '@core/entities/product'
import { baby } from '@utils/testData/categories'

export const dolodent: Product = {
  uuid: 'product-dolodent',
  name: 'Dolodent solution 27g',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_195_1.jpg',
  images: [
    'https://www.pharmacieagnespraden.com/52664-large_default/dolodent-solution-gingivale-27-g.jpg'
  ],
  categoryUuid: 'category-dents',
  cip13: '3400921929201',
  priceWithoutTax: 500,
  percentTaxRate: 10,
  locations: ['DD02'],
  availableStock: 59,
  laboratory: 'Gilbert'
}

export const ultraLevure: Product = {
  uuid: 'product-ultralevure',
  name: 'Ultra levure 200 mg 10 gélules',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_198_1.jpg?time=1675901328',
  images: [
    'https://www.pharmacieagnespraden.com/54697-large_default/ultra-levure-200-mg.jpg'
  ],
  categoryUuid: 'category-diarrhee',
  cip7: '3400922',
  cip13: '3400922096612',
  ean13: '3400922096612',
  priceWithoutTax: 432,
  percentTaxRate: 10,
  locations: ['C3'],
  availableStock: 36,
  laboratory: 'BIOCODEX',
  description: '<p> ultralevure description</p>',
  instructionsForUse: '<p> ultralevure instructions</p>',
  composition: '<p> ultralevure composition</p>'
}

export const anaca3Minceur: Product = {
  uuid: 'product-anaca3minceur',
  name: 'Anaca3 Perte de Poids Infusion 24 Sachets',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_198_1.jpg?time=1675901328',
  images: [
    'https://www.pharmacieagnespraden.com/72000-large_default/anaca-3-minc-infus-perte-poids-24sach.jpg'
  ],
  categoryUuid: 'category-minceur',
  cip13: '3760007337185',
  priceWithoutTax: 891,
  percentTaxRate: 5.5,
  locations: ['1D450'],
  availableStock: 36,
  laboratory: 'ANACA 3'
}

export const chamomilla: Product = {
  uuid: 'product-chamomilla',
  name: 'Chamomilla vulgaris 9CH suppositoires Boiron (poussée dentaire)',
  miniature:
    'https://www.pharmacieagnespraden.com/img/tmp/product_mini_198_1.jpg?time=1675901328',
  images: [
    'https://www.pharmacieagnespraden.com/55-large_default/chamomilla-vulgaris-9-ch-boiron-12-suppositoires.jpg'
  ],
  categoryUuid: 'category-dents',
  cip13: '3400921924008',
  priceWithoutTax: 627,
  percentTaxRate: 10,
  locations: ['HOMEO-D'],
  availableStock: 1,
  laboratory: 'BOIRON'
}

export const calmosine: Product = {
  uuid: 'product-calmosine',
  name: 'Calmosine 100 ml',
  images: [
    'https://www.pharmacieagnespraden.com/70697-home_default/calmosine-100ml.jpg'
  ],
  miniature: '',
  categoryUuid: baby.uuid,
  cip13: '1234567890123',
  priceWithoutTax: 810,
  percentTaxRate: 10,
  locations: ['E2'],
  availableStock: 10,
  laboratory: 'NUTRISANTE'
}

export const hemoclar: Product = {
  uuid: 'product-hemoclar',
  name: 'Hemoclar 0,5% crème 30g',
  images: [
    'https://fakeimg.pl/300/',
    'https://fakeimg.pl/400/',
    'https://fakeimg.pl/300/'
  ],
  miniature: '',
  categoryUuid: baby.uuid,
  cip13: '098765432123',
  priceWithoutTax: 590,
  percentTaxRate: 10,
  locations: ['D2'],
  availableStock: 23,
  laboratory: 'SANOFI-AVENTIS'
}

export const productWithoutLocation: Product = {
  uuid: 'product-withoutlocation',
  name: 'Product without location',
  images: ['https://fakeimg.pl/300/'],
  miniature: '',
  categoryUuid: baby.uuid,
  cip13: '0637218312823',
  priceWithoutTax: 590,
  percentTaxRate: 10,
  locations: [],
  availableStock: 23,
  laboratory: 'SANOFI-AVENTIS'
}
