import {
  ExistingProductFormInitializer,
  ProductFormGetVM,
  productFormGetVM
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { SequentialUuidGenerator } from '@adapters/secondary/uuid-generators/SequentialUuidGenerator'
import {
  createExistingImage,
  type ProductImage
} from '@core/entities/productImage'
import { useCategoryStore } from '@store/categoryStore'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useLocationStore } from '@store/locationStore'
import { useProductStore } from '@store/productStore'
import { baby, minceur, mum } from '@utils/testData/categories'
import {
  anaca3,
  avene,
  gilbert,
  sanofiAventis
} from '@utils/testData/laboratories'
import { magasin, reserve, zoneGeo } from '@utils/testData/locations'
import {
  dolodent,
  hemoclar,
  productWithDecimalPrice,
  productWithoutLaboratory,
  ultraLevure
} from '@utils/testData/products'
import { promotionFixedMultipleProducts } from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'

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
      expectedIsActive: false,
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
      expectedIsActive: true,
      expectedPriceWithoutTax: '5.00',
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
      expectedIsActive: true,
      expectedPriceWithoutTax: '5.90',
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
    },
    {
      product: productWithDecimalPrice,
      expectedIsActive: true,
      expectedPriceWithoutTax: '3.33',
      expectedPriceWithTax: '3.99',
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
        expectedIsActive,
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
          { field: 'weight', expected: expectedWeight },
          { field: 'isActive', expected: expectedIsActive }
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
  describe('Loading', () => {
    it('should be aware during loading', () => {
      productStore.isLoading = true
      expect(vm.isLoading()).toBe(true)
    })
    it('should be aware when not loading', () => {
      productStore.isLoading = false
      expect(vm.isLoading()).toBe(false)
    })
  })

  describe('ProductImages initialization', () => {
    it('should transform backend images to ProductImage array', () => {
      const uuidGenerator = new SequentialUuidGenerator('img')
      productStore.current = { product: hemoclar }
      locationStore.items = [zoneGeo]
      categoryStore.items = [baby]
      laboratoryStore.items = [sanofiAventis]

      const initializer = new ExistingProductFormInitializer(key, uuidGenerator)
      initializer.init()

      const expectedProductImages: Array<ProductImage> = [
        createExistingImage('https://fakeimg.pl/300/', 'img-0', 0),
        createExistingImage('https://fakeimg.pl/400/', 'img-1', 1),
        createExistingImage('https://fakeimg.pl/300/', 'img-2', 2)
      ]
      expect(formStore.get(key).productImages).toStrictEqual(
        expectedProductImages
      )
    })

    it('should store initial image URLs for reference', () => {
      const uuidGenerator = new SequentialUuidGenerator('img')
      productStore.current = { product: hemoclar }
      locationStore.items = [zoneGeo]
      categoryStore.items = [baby]
      laboratoryStore.items = [sanofiAventis]

      const initializer = new ExistingProductFormInitializer(key, uuidGenerator)
      initializer.init()

      expect(formStore.get(key).initialImageUrls).toStrictEqual([
        'https://fakeimg.pl/300/',
        'https://fakeimg.pl/400/',
        'https://fakeimg.pl/300/'
      ])
    })

    it('should return product images for display sorted by order', () => {
      productStore.current = { product: hemoclar }
      locationStore.items = [zoneGeo]
      categoryStore.items = [baby]
      laboratoryStore.items = [sanofiAventis]
      vm = productFormGetVM(key)

      const images = vm.getProductImagesForDisplay()
      const urls = images.map((img) => img.url)
      expect(urls).toStrictEqual([
        'https://fakeimg.pl/300/',
        'https://fakeimg.pl/400/',
        'https://fakeimg.pl/300/'
      ])
    })
  })
})
