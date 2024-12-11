import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { useFormStore } from '@store/formStore'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { createPinia, setActivePinia } from 'pinia'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  anaca3Minceur,
  calmosine,
  chamomilla,
  dolodent
} from '@utils/testData/products'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { avene, gilbert } from '@utils/testData/laboratories'
import {
  laboratoryFormGetVM,
  LaboratoryFormGetVM,
  LaboratoryProductItemVM
} from './laboratoryFormGetVM'

const anaca3VM: LaboratoryProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  categories: anaca3Minceur.categories.map((c) => c.name)
}

const calmosineVM: LaboratoryProductItemVM = {
  uuid: calmosine.uuid,
  name: calmosine.name,
  reference: calmosine.ean13,
  categories: calmosine.categories.map((c) => c.name)
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
  }
]

describe('Laboratory form get VM', () => {
  let laboratoryStore: any
  let productStore: any
  let formStore: any
  const key = 'get-laboratory-form'
  let vm: LaboratoryFormGetVM

  beforeEach(() => {
    setActivePinia(createPinia())
    laboratoryStore = useLaboratoryStore()
    productStore = useProductStore()
    formStore = useFormStore()
  })
  describe.each([
    {
      laboratory: avene,
      products: [],
      expectedProducts: []
    },
    {
      laboratory: gilbert,
      products: [anaca3Minceur, calmosine],
      expectedProducts: [anaca3VM, calmosineVM]
    }
  ])('Initial VM', ({ laboratory, products, expectedProducts }) => {
    beforeEach(() => {
      laboratoryStore.current = { laboratory, products }
      givenExistingProducts(dolodent, anaca3Minceur, chamomilla, calmosine)
      vm = getVM()
    })
    describe.each([
      { field: 'name', expected: laboratory.name },
      { field: 'description', expected: laboratory.description },
      { field: 'miniature', expected: laboratory.miniature },
      { field: 'image', expected: laboratory.image }
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
  describe('Loading', () => {
    it('should be aware during loading', () => {
      laboratoryStore.isLoading = true
      expect(vm.isLoading()).toBe(true)
    })
    it('should be aware when not loading', () => {
      laboratoryStore.isLoading = false
      expect(vm.isLoading()).toBe(false)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
  }

  const getVM = (): LaboratoryFormGetVM => {
    return laboratoryFormGetVM(key)
  }
})
