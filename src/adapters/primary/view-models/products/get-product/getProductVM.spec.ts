import { baby, dents, minceur, mum } from '@utils/testData/categories'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import {
  getProductVM,
  GetProductVM
} from '@adapters/primary/view-models/products/get-product/getProductVM'
import { chamomilla, dolodent, ultraLevure } from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useCategoryStore } from '@store/categoryStore'
import { Category } from '@core/entities/category'

describe('Get product VM', () => {
  let formStore: any
  let productStore: any
  let categoryStore: any
  const key = 'testRoute'
  let vm: GetProductVM
  const availableCategories: Array<Category> = [baby, dents, minceur, mum]
  const availableProducts: Array<Product> = [dolodent, chamomilla, ultraLevure]

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    productStore = useProductStore()
    productStore.items = availableProducts
    categoryStore = useCategoryStore()
    categoryStore.items = availableCategories
  })
  describe('Initial VM', () => {
    const product = ultraLevure
    beforeEach(() => {
      productStore.current = product
      vm = getProductVM(key)
    })
    describe.each([
      { field: 'name', expected: product.name },
      { field: 'categoryUuid', expected: product.categoryUuid },
      { field: 'cip7', expected: product.cip7 },
      { field: 'cip13', expected: product.cip13 },
      { field: 'ean13', expected: product.ean13 },
      { field: 'priceWithoutTax', expected: '4.32' },
      { field: 'percentTaxRate', expected: product.percentTaxRate },
      { field: 'priceWithTax', expected: '4.75' },
      { field: 'laboratory', expected: product.laboratory },
      { field: 'location', expected: product.location },
      { field: 'availableStock', expected: product.availableStock },
      { field: 'images', expected: product.images },
      { field: 'newImages', expected: [] },
      { field: 'description', expected: product.description },
      { field: 'instructionsForUse', expected: product.instructionsForUse },
      { field: 'composition', expected: product.composition }
    ])('Field', ({ field, expected }) => {
      it(`should have an empty ${field}`, () => {
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
        expect(vm.getAvailableCategories()).toStrictEqual([
          {
            uuid: baby.uuid,
            name: baby.name
          },
          {
            uuid: dents.uuid,
            name: dents.name
          },
          {
            uuid: minceur.uuid,
            name: minceur.name
          },
          {
            uuid: mum.uuid,
            name: mum.name
          }
        ])
      })
    })
  })
  describe('Validation', () => {
    it('should not allow to validate', () => {
      expect(vm.getCanValidate()).toBe(false)
    })
    it('should not display validate', () => {
      expect(vm.getDisplayValidate()).toBe(false)
    })
  })
})
