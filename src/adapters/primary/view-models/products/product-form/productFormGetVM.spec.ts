import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import { baby, minceur, mum } from '@utils/testData/categories'
import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  ProductFormGetVM,
  productFormGetVM
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import {
  dolodent,
  productWithoutLaboratory,
  ultraLevure
} from '@utils/testData/products'
import { useProductStore } from '@store/productStore'
import { useLocationStore } from '@store/locationStore'
import { magasin, reserve, zoneGeo } from '@utils/testData/locations'
import { promotionFixedMultipleProducts } from '@utils/testData/promotions'
import { useCategoryStore } from '@store/categoryStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import {
  anaca3,
  avene,
  gilbert,
  sanofiAventis
} from '@utils/testData/laboratories'

describe('Product form get VM', () => {
  let locationStore: any
  let vm: ProductFormGetVM
  let productStore: any
  let categoryStore: any
  let laboratoryStore: any
  let formStore: any
  const key = 'get-product-key'
  beforeEach(() => {
    setActivePinia(createPinia())
    locationStore = useLocationStore()
    formStore = useFormStore()
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    laboratoryStore = useLaboratoryStore()
  })

  const productsTestsCases = [
    {
      product: ultraLevure,
      expectedPriceWithoutTax: '4.32',
      expectedPriceWithTax: '4.75',
      expectedLocations: {
        [zoneGeo.uuid]: 'C3',
        [reserve.uuid]: 'RESERVE_1'
      },
      expectedWeight: '0.012',
      promotion: promotionFixedMultipleProducts,
      expectedPromotion: {
        href: `/promotions/get/${promotionFixedMultipleProducts.uuid}`,
        type: 'FIXE',
        amount: '1,00\u00A0€',
        startDate: '27 juil. 2023',
        startDatetime: new Date('2023-07-27T00:00:00.000Z'),
        endDate: '27 août 2023',
        endDatetime: new Date('2023-08-27T00:00:00.000Z')
      },
      availableLocations: [zoneGeo, reserve, magasin],
      expectedAvailableLocations: [
        {
          uuid: zoneGeo.uuid,
          name: zoneGeo.name
        },
        {
          uuid: reserve.uuid,
          name: reserve.name
        },
        {
          uuid: magasin.uuid,
          name: magasin.name
        }
      ],
      availableCategories: [baby, mum, minceur],
      expectedAvailableCategories: [
        {
          uuid: baby.uuid,
          name: baby.name
        },
        {
          uuid: mum.uuid,
          name: mum.name
        },
        {
          uuid: minceur.uuid,
          name: minceur.name
        }
      ],
      availableLaboratories: [avene, gilbert, sanofiAventis],
      expectedAvailableLaboratories: [
        {
          uuid: avene.uuid,
          name: avene.name
        },
        {
          uuid: gilbert.uuid,
          name: gilbert.name
        },
        {
          uuid: sanofiAventis.uuid,
          name: sanofiAventis.name
        }
      ]
    },
    {
      product: dolodent,
      expectedPriceWithoutTax: '5',
      expectedPriceWithTax: '5.50',
      expectedLocations: {
        [zoneGeo.uuid]: 'DD02'
      },
      expectedWeight: '0.98',
      promotion: undefined,
      expectedPromotion: undefined,
      availableLocations: [zoneGeo, magasin],
      expectedAvailableLocations: [
        {
          uuid: zoneGeo.uuid,
          name: zoneGeo.name
        },
        {
          uuid: magasin.uuid,
          name: magasin.name
        }
      ],
      availableCategories: [minceur],
      expectedAvailableCategories: [
        {
          uuid: minceur.uuid,
          name: minceur.name
        }
      ],
      availableLaboratories: [anaca3],
      expectedAvailableLaboratories: [
        {
          uuid: anaca3.uuid,
          name: anaca3.name
        }
      ]
    },
    {
      product: productWithoutLaboratory,
      expectedPriceWithoutTax: '5.9',
      expectedPriceWithTax: '6.49',
      expectedLocations: {},
      expectedWeight: '0.12',
      promotion: undefined,
      expectedPromotion: undefined,
      availableLocations: [zoneGeo, magasin],
      expectedAvailableLocations: [
        {
          uuid: zoneGeo.uuid,
          name: zoneGeo.name
        },
        {
          uuid: magasin.uuid,
          name: magasin.name
        }
      ],
      availableCategories: [minceur],
      expectedAvailableCategories: [
        {
          uuid: minceur.uuid,
          name: minceur.name
        }
      ],
      availableLaboratories: [anaca3],
      expectedAvailableLaboratories: [
        {
          uuid: anaca3.uuid,
          name: anaca3.name
        }
      ]
    }
  ]
  describe('Initial VM', () => {
    describe.each(productsTestsCases)(
      'For a product',
      ({
        product,
        expectedPriceWithoutTax,
        expectedPriceWithTax,
        expectedLocations,
        expectedWeight,
        promotion,
        expectedPromotion,
        availableLocations,
        expectedAvailableLocations,
        availableCategories,
        expectedAvailableCategories,
        availableLaboratories,
        expectedAvailableLaboratories
      }) => {
        beforeEach(() => {
          productStore.current = {
            product,
            promotion
          }
          locationStore.items = availableLocations
          categoryStore.items = availableCategories
          laboratoryStore.items = availableLaboratories
          vm = productFormGetVM(key)
        })
        describe.each([
          { field: 'name', expected: product.name },
          {
            field: 'categoryUuids',
            expected: product.categories.map((c) => c.uuid)
          },
          { field: 'cip7', expected: product.cip7 },
          { field: 'cip13', expected: product.cip13 },
          { field: 'ean13', expected: product.ean13 },
          { field: 'images', expected: product.images },
          { field: 'percentTaxRate', expected: product.percentTaxRate },
          { field: 'availableStock', expected: product.availableStock },
          { field: 'laboratory', expected: product.laboratory?.uuid || '' },
          { field: 'description', expected: product.description },
          { field: 'instructionsForUse', expected: product.instructionsForUse },
          { field: 'composition', expected: product.composition },
          {
            field: 'maxQuantityForOrder',
            expected: product.maxQuantityForOrder
          },
          { field: 'isMedicine', expected: product.isMedicine },
          { field: 'priceWithoutTax', expected: expectedPriceWithoutTax },
          { field: 'priceWithTax', expected: expectedPriceWithTax },
          { field: 'locations', expected: expectedLocations },
          { field: 'weight', expected: expectedWeight }
        ])('Initial field value', ({ field, expected }) => {
          it(`should have ${field} to be "${expected}"`, () => {
            const expectedField: Field<any> = {
              value: expected,
              canEdit: false
            }
            expect(vm.get(field)).toStrictEqual(expectedField)
          })
          it(`should save the ${field} value in form store`, () => {
            expect(formStore.get(key)[field]).toStrictEqual(expected)
          })
        })
        describe('Category choices', () => {
          it('should provide all categories', () => {
            expect(vm.getAvailableCategories()).toStrictEqual(
              expectedAvailableCategories
            )
          })
        })
        describe('Laboratory choices', () => {
          it('should provide all laboratories', () => {
            expect(vm.getAvailableLaboratories()).toStrictEqual(
              expectedAvailableLaboratories
            )
          })
        })
        describe('Locations choices', () => {
          it('should provide all locations', () => {
            expect(vm.getAvailableLocations()).toStrictEqual(
              expectedAvailableLocations
            )
          })
        })
        describe('Promotion', () => {
          it('should provide the promotion', () => {
            expect(vm.getPromotion()).toStrictEqual(expectedPromotion)
          })
        })
      }
    )
  })
  describe('Validation', () => {
    describe('Display validate', () => {
      it('should always display the validate button', () => {
        expect(vm.getDisplayValidate()).toBe(false)
      })
    })
    describe('Can validate', () => {
      it('should allow to validate at start', () => {
        expect(vm.getCanValidate()).toBe(false)
      })
    })
  })
})
