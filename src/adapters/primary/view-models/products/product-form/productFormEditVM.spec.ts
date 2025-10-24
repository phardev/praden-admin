import { type Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { ProductStatus } from '@core/entities/product'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
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
import { dolodent, ultraLevure } from '@utils/testData/products'
import { promotionFixedMultipleProducts } from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'
import { ProductFormEditVM, productFormEditVM } from './productFormEditVM'

describe('Product form edit VM', () => {
  let locationStore: any
  let vm: ProductFormEditVM
  let productStore: any
  let categoryStore: any
  let laboratoryStore: any
  let formStore: any
  const key = 'edit-product-key'
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
      status: ultraLevure.status,
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
      status: dolodent.status,
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
          vm = productFormEditVM(key)
        })
        describe.each([
          { field: 'name', expected: product.name },
          { field: 'status', expected: product.status },
          {
            field: 'categoryUuids',
            expected: product.categories.map((c) => c.uuid)
          },
          { field: 'cip7', expected: product.cip7 },
          { field: 'cip13', expected: product.cip13 },
          { field: 'ean13', expected: product.ean13 },
          { field: 'images', expected: product.images },
          { field: 'removedImages', expected: [] },
          { field: 'percentTaxRate', expected: product.percentTaxRate },
          { field: 'availableStock', expected: product.availableStock },
          { field: 'laboratory', expected: product.laboratory!.uuid },
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
              canEdit: true
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
        describe('Locations choices', () => {
          it('should provide all locations', () => {
            expect(vm.getAvailableLocations()).toStrictEqual(
              expectedAvailableLocations
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
        describe('Promotion', () => {
          it('should provide the promotion', () => {
            expect(vm.getPromotion()).toStrictEqual(expectedPromotion)
          })
        })
      }
    )
  })
  describe('Toggle categories', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
    })
    describe('Simple toggle', () => {
      it('should add the category to the list of categories', () => {
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [...product.categories.map((c) => c.uuid), 'added-category'],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Simple toggle on multiple categories', () => {
      it('should add the categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        const expectedField: Field<any> = {
          value: [
            ...product.categories.map((c) => c.uuid),
            'added-category',
            'another-added-category'
          ],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Toggle 2 times a category', () => {
      it('should not add the category to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [...product.categories.map((c) => c.uuid)],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Complex toggle', () => {
      it('should add some categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('added-category')
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('wow-category')
        vm.toggleCategory('batman-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [
            ...product.categories.map((c) => c.uuid),
            'wow-category',
            'batman-category',
            'another-added-category'
          ],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
  })
  describe('Toggle is active', () => {
    it('should toggle is active', () => {
      const product = JSON.parse(JSON.stringify(ultraLevure))
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
      vm.toggleIsActive()
      expect(vm.get('isActive')).toStrictEqual({
        canEdit: true,
        value: true
      })
    })
    it('should toggle 2 times', () => {
      const product = JSON.parse(JSON.stringify(ultraLevure))
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
      vm.toggleIsActive()
      vm.toggleIsActive()
      expect(vm.get('isActive')).toStrictEqual({
        canEdit: true,
        value: false
      })
    })
  })
  describe('Change laboratory', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
    })
    describe('Simple toggle on multiple categories', () => {
      it('should add the categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        const expectedField: Field<any> = {
          value: [
            ...product.categories.map((c) => c.uuid),
            'added-category',
            'another-added-category'
          ],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Toggle 2 times a category', () => {
      it('should not add the category to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [...product.categories.map((c) => c.uuid)],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
    describe('Complex toggle', () => {
      it('should add some categories to the list of categories', () => {
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('added-category')
        vm.toggleCategory('added-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('wow-category')
        vm.toggleCategory('batman-category')
        vm.toggleCategory('another-added-category')
        vm.toggleCategory('added-category')
        const expectedField: Field<any> = {
          value: [
            ...product.categories.map((c) => c.uuid),
            'wow-category',
            'batman-category',
            'another-added-category'
          ],
          canEdit: true
        }
        expect(vm.get('categoryUuids')).toStrictEqual(expectedField)
      })
    })
  })

  describe('Remove image', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      vm = productFormEditVM(key)
    })
    describe('Images are already saved', () => {
      it('should remove saved displayed images', async () => {
        await vm.removeImage(dolodent.images[0])
        expect(vm.get('images').value).toStrictEqual([])
      })
    })
  })

  describe('DTO', () => {
    const product = dolodent
    beforeEach(() => {
      productStore.current = {
        product
      }
      laboratoryStore.items = [avene, sanofiAventis]
      vm = productFormEditVM(key)
    })
    describe('For a dto without max quantity for order', () => {
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: EditProductDTO = {
          name: 'test',
          status: ProductStatus.Active,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: [...product.categories.map((c) => c.uuid), 'abc123'],
          laboratory: avene,
          miniature: newMiniature,
          removedImages: [],
          newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: product.locations,
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: undefined,
          flags: { arePromotionsAllowed: product.flags.arePromotionsAllowed }
        }
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        vm.toggleCategory('abc123')
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', undefined)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto', () => {
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: EditProductDTO = {
          name: 'test',
          status: ProductStatus.Inactive,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: [...product.categories.map((c) => c.uuid), 'abc123'],
          laboratory: avene,
          miniature: newMiniature,
          removedImages: [],
          newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: product.locations,
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: 12,
          flags: { arePromotionsAllowed: false }
        }
        vm.toggleIsActive()
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        vm.toggleCategory('abc123')
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', '12')
        vm.set('arePromotionsAllowed', false)
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
    describe('For a dto with removed images', () => {
      it('should prepare the dto', async () => {
        const newImages = [
          new File(['data1'], 'File 1', { type: 'image/png' }),
          new File(['data2'], 'File 2', { type: 'image/jpeg' }),
          new File(['data3'], 'File 3', { type: 'image/gif' })
        ]
        const newMiniature = new File(['data1'], 'MINIATURE', {
          type: 'image/png'
        })
        const expectedDTO: EditProductDTO = {
          name: 'test',
          status: ProductStatus.Inactive,
          cip7: '1234567',
          cip13: '1234567890123',
          ean13: '1234567890123',
          categoryUuids: [...product.categories.map((c) => c.uuid), 'abc123'],
          laboratory: avene,
          miniature: newMiniature,
          removedImages: [dolodent.images[0]],
          newImages,
          priceWithoutTax: 1200,
          percentTaxRate: 5,
          locations: product.locations,
          availableStock: 21,
          description: '<p>description</p>',
          instructionsForUse: '<p>instructionsForUse</p>',
          composition: '<p>composition</p>',
          weight: 1200,
          maxQuantityForOrder: 12,
          flags: { arePromotionsAllowed: true }
        }
        vm.toggleIsActive()
        vm.set('name', expectedDTO.name)
        vm.set('cip7', expectedDTO.cip7)
        vm.set('cip13', expectedDTO.cip13)
        vm.set('ean13', expectedDTO.ean13)
        await vm.set('miniature', newMiniature)
        await vm.set('newImages', newImages)
        vm.toggleCategory('abc123')
        vm.set('laboratory', expectedDTO.laboratory!.uuid)
        vm.set('priceWithoutTax', '12')
        vm.set('percentTaxRate', '5')
        vm.set('locations', expectedDTO.locations)
        vm.set('availableStock', '21')
        vm.set('description', expectedDTO.description)
        vm.set('instructionsForUse', expectedDTO.instructionsForUse)
        vm.set('composition', expectedDTO.composition)
        vm.set('weight', '1.2')
        vm.set('maxQuantityForOrder', '12')
        vm.removeImage(dolodent.images[0])
        expect(vm.getDto()).toStrictEqual(expectedDTO)
      })
    })
  })

  describe('Validation', () => {
    describe('Display validate', () => {
      it('should always display the validate button', () => {
        expect(vm.getDisplayValidate()).toBe(true)
      })
    })
    describe('Can validate', () => {
      it('should allow to validate at start', () => {
        expect(vm.getCanValidate()).toBe(true)
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
})
