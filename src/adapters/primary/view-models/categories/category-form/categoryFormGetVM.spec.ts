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
  dolodent,
  productWithoutLaboratory
} from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { CategoryProductItemVM } from '@adapters/primary/view-models/categories/category-form/categoryFormVM'

const anaca3VM: CategoryProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  categories: anaca3Minceur.categories.map((c) => c.name),
  laboratory: anaca3Minceur.laboratory.name
}

const calmosineVM: CategoryProductItemVM = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  reference: calmosine.ean13,
  categories: calmosine.categories.map((c) => c.name),
  laboratory: calmosine.laboratory.name
}

const productWithoutLaboratoryVM: CategoryProductItemVM = {
  uuid: productWithoutLaboratory.uuid,
  name: productWithoutLaboratory.name,
  reference: productWithoutLaboratory.ean13,
  categories: productWithoutLaboratory.categories.map((c) => c.name),
  laboratory: ''
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
    name: 'Catégories',
    value: 'categories'
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
      products: [anaca3Minceur, calmosine, productWithoutLaboratory],
      expectedProducts: [anaca3VM, calmosineVM, productWithoutLaboratoryVM]
    }
  ])('Initial VM', ({ category, products, expectedProducts }) => {
    beforeEach(() => {
      categoryStore.current = { category, products }
      givenExistingProducts(
        dolodent,
        anaca3Minceur,
        chamomilla,
        calmosine,
        productWithoutLaboratory
      )
      vm = getVM()
    })
    describe.each([
      { field: 'name', expected: category.name },
      { field: 'description', expected: category.description },
      { field: 'miniature', expected: category.miniature },
      { field: 'image', expected: category.image },
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
  describe('Loading', () => {
    it('should be aware during loading', () => {
      categoryStore.isLoading = true
      expect(vm.isLoading()).toBe(true)
    })
    it('should be aware when not loading', () => {
      categoryStore.isLoading = false
      expect(vm.isLoading()).toBe(false)
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
