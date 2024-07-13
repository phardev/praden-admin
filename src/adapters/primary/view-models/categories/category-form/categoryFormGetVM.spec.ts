import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { baby, minceur } from '@utils/testData/categories'
import { createPinia, setActivePinia } from 'pinia'
import {
  CategoryFormGetVM,
  categoryFormGetVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent
} from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { CategoryProductItemVM } from '@adapters/primary/view-models/categories/category-form/categoryFormVM'

const anaca3VM: CategoryProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.cip13,
  laboratory: anaca3Minceur.laboratory
}

const calmosineVM: CategoryProductItemVM = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  reference: calmosine.cip13,
  laboratory: calmosine.laboratory
}

const expectedProductsHeader: Array<Header> = [
  {
    name: 'Nom',
    value: 'name'
  },
  {
    name: 'Référence',
    value: 'reference'
  },
  {
    name: 'Laboratoire',
    value: 'laboratory'
  }
]

describe('Category form get VM', () => {
  let categoryStore: any
  let productStore: any
  let formStore: any
  const key = 'get-category-form'
  let vm: CategoryFormGetVM

  beforeEach(() => {
    setActivePinia(createPinia())
    categoryStore = useCategoryStore()
    productStore = useProductStore()
    formStore = useFormStore()
  })
  describe.each([
    {
      category: baby,
      products: [],
      expectedProducts: []
    },
    {
      category: minceur,
      products: [anaca3Minceur.uuid, calmosine.uuid],
      expectedProducts: [anaca3VM, calmosineVM]
    }
  ])('Initial VM', ({ category, products, expectedProducts }) => {
    beforeEach(() => {
      categoryStore.current = { category, products }
      givenExistingProducts(dolodent, anaca3Minceur, chamomilla, calmosine)
      vm = getVM()
    })
    describe.each([
      { field: 'name', expected: category.name },
      { field: 'description', expected: category.description },
      { field: 'miniature', expected: category.miniature },
      { field: 'img', expected: category.img },
      { field: 'parentUuid', expected: category.parentUuid }
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
      it('should provide an empty array', () => {
        expect(vm.getAvailableCategories()).toStrictEqual([])
      })
    })
    describe('Products', () => {
      it('should get the products headers', () => {
        expect(vm.getProductsHeaders()).toStrictEqual(expectedProductsHeader)
      })
      it('should get the products', () => {
        const expectedProductsField = {
          value: expectedProducts,
          canEdit: false
        }
        expect(vm.getProducts()).toStrictEqual(expectedProductsField)
      })
    })
  })
  describe('Validation', () => {
    describe('Display validate', () => {
      it('should never display the validate button', () => {
        expect(vm.getDisplayValidate()).toBe(false)
      })
    })
    describe('Can validate', () => {
      it('should not allow to validate', () => {
        expect(vm.getCanValidate()).toBe(false)
      })
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
  }

  const getVM = (): CategoryFormGetVM => {
    return categoryFormGetVM(key)
  }
})
