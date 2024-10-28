import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import {
  Field,
  PromotionFormCreateVM,
  promotionFormCreateVM,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import {
  anaca3Minceur,
  calmosine,
  dolodent,
  ultraLevure
} from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

const anaca3VM: PromotionProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  categories: anaca3Minceur.categories.map((c) => c.name),
  laboratory: anaca3Minceur.laboratory
}

const ultraLevureVM: PromotionProductItemVM = {
  uuid: ultraLevure.uuid,
  name: ultraLevure.name,
  reference: ultraLevure.ean13,
  categories: ultraLevure.categories.map((c) => c.name),
  laboratory: ultraLevure.laboratory
}

const dolodentVM: PromotionProductItemVM = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  reference: dolodent.ean13,
  categories: dolodent.categories.map((c) => c.name),
  laboratory: dolodent.laboratory
}

const availableTypeChoices: Array<TypeChoiceVM> = [
  {
    type: ReductionType.Fixed,
    text: 'Euros'
  },
  {
    type: ReductionType.Percentage,
    text: 'Pourcentage'
  }
]

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
    name: 'Catégorie',
    value: 'category'
  },
  {
    name: 'Laboratoire',
    value: 'laboratory'
  }
]

describe('Promotion form create VM', () => {
  let formStore: any
  let vm: PromotionFormCreateVM
  let productStore: any
  let searchStore: any
  const key = 'create-promotion-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    productStore = useProductStore()
    searchStore = useSearchStore()
  })
  describe('Promotion VM', () => {
    describe('VM initialization', () => {
      const basicFields = [
        { field: 'name' },
        { field: 'type' },
        { field: 'amount' },
        { field: 'startDate' },
        { field: 'endDate' }
      ]
      const expectedFields = {
        name: '',
        type: ReductionType.Fixed,
        amount: undefined,
        startDate: undefined,
        endDate: undefined
      }
      beforeEach(() => {
        whenGetProductFormCreateVM()
      })
      describe.each(basicFields)('Basic fields initialization', ({ field }) => {
        it(`should initialize ${field}"`, () => {
          const expectedField: Field<any> = {
            value: expectedFields[field],
            canEdit: true
          }
          expect(vm.get(field)).toStrictEqual(expectedField)
        })
        it(`should save the ${field} value in form store`, () => {
          expect(formStore.get(key)[field]).toStrictEqual(expectedFields[field])
        })
      })
    })
  })
  describe('Available products', () => {
    describe('There is no product in the store, nor in the search results', () => {
      it('should not have available products', () => {
        const expectedField: Field<any> = {
          value: [],
          canEdit: true
        }
        whenGetProductFormCreateVM()
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('There is some products in the store, but not in the search results', () => {
      beforeEach(() => {
        givenExistingProducts(dolodent, anaca3Minceur)
        whenGetProductFormCreateVM()
      })
      it('should have available products', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, anaca3VM],
          canEdit: true
        }
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('There is some products in the search result', () => {
      beforeEach(() => {
        givenExistingProducts(dolodent, anaca3Minceur)
        givenExistingSearchResult(ultraLevure)
        whenGetProductFormCreateVM()
      })
      it('should have available products', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [ultraLevureVM],
          canEdit: true
        }
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })

    describe('There is products already added', () => {
      describe('There is no search', () => {
        beforeEach(() => {
          givenExistingProducts(dolodent, anaca3Minceur)
          whenGetProductFormCreateVM()
          vm.addProducts([dolodent.uuid])
        })
        it('should have available products without already added products', () => {
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [anaca3VM],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
      })
      describe('There is search', () => {
        beforeEach(() => {
          givenExistingSearchResult(dolodent, anaca3Minceur)
          whenGetProductFormCreateVM()
          vm.addProducts([dolodent.uuid])
        })
        it('should have available products without already added products', () => {
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [anaca3VM],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
      })
    })
  })
  describe('Products', () => {
    describe('Add products from product store', () => {
      beforeEach(() => {
        givenExistingProducts(dolodent, ultraLevure, anaca3Minceur)
        whenGetProductFormCreateVM()
        vm.addProducts([dolodent.uuid, anaca3Minceur.uuid])
      })
      it('should add the products', () => {
        const expectedField: Field<Array<Product>> = {
          value: [dolodent, anaca3Minceur],
          canEdit: true
        }
        expect(vm.get('products')).toStrictEqual(expectedField)
      })
      it('should give the right products VM', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, anaca3VM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
    })
    describe('Add products from search result', () => {
      beforeEach(() => {
        givenExistingProducts()
        givenExistingSearchResult(dolodent, ultraLevure, anaca3Minceur)
        whenGetProductFormCreateVM()
        vm.addProducts([ultraLevure.uuid, anaca3Minceur.uuid])
      })
      it('should add the products', () => {
        const expectedField: Field<Array<Product>> = {
          value: [ultraLevure, anaca3Minceur],
          canEdit: true
        }
        expect(vm.get('products')).toStrictEqual(expectedField)
      })
      it('should give the right products VM', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [ultraLevureVM, anaca3VM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
    })
  })
  describe('Validation', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent)
      whenGetProductFormCreateVM()
      vm.set('name', 'Test')
      vm.set('amount', 12)
      vm.addProducts([dolodent.uuid])
    })
    describe('Can validate', () => {
      it('should allow to validate', () => {
        expect(vm.getCanValidate()).toBeTruthy()
      })
    })
    describe('Can not validate', () => {
      it('should not allow to validate if there is no name', () => {
        vm.set('name', '')
        expect(vm.getCanValidate()).toBe(false)
      })
      it('should not allow to validate if there is no amount', () => {
        vm.set('amount', undefined)
        expect(vm.getCanValidate()).toBe(false)
      })
      it('should not allow to validate if there is no product selected', () => {
        vm.removeProducts([dolodent.uuid])
        expect(vm.getCanValidate()).toBeFalsy()
      })
    })
    it('should display validate button any time', () => {
      expect(vm.getDisplayValidate()).toBeTruthy()
    })
  })
  describe('Type choices', () => {
    it('should provide available type choices', () => {
      expect(vm.getAvailableTypeChoices()).toStrictEqual(availableTypeChoices)
    })
  })
  describe('Product headers', () => {
    it('should provide product headers', () => {
      expect(vm.getProductsHeaders()).toStrictEqual(expectedProductsHeader)
    })
  })

  describe('Dto', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent, calmosine)
      whenGetProductFormCreateVM()
    })
    it('should prepare the promotion dto', () => {
      vm.set('name', 'Test')
      vm.set('amount', 1.5)
      vm.addProducts([dolodent.uuid])
      const expectedDto: CreatePromotionDTO = {
        name: 'Test',
        products: [dolodent],
        type: ReductionType.Fixed,
        amount: 150
      }
      expect(vm.getDto()).toStrictEqual(expectedDto)
    })
    it('should prepare another promotion dto', () => {
      vm.set('type', ReductionType.Percentage)
      vm.set('name', 'AnotherTest')
      vm.set('amount', 5.5)
      vm.set('startDate', 123456789)
      vm.set('endDate', 987654321)
      vm.addProducts([dolodent.uuid, calmosine.uuid])
      const expectedDto: CreatePromotionDTO = {
        name: 'AnotherTest',
        products: [dolodent, calmosine],
        type: ReductionType.Percentage,
        amount: 5.5,
        startDate: 123456789,
        endDate: 987654321
      }
      expect(vm.getDto()).toStrictEqual(expectedDto)
    })
  })

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.list(products)
  }

  const givenExistingSearchResult = (...searchResults: Array<Product>) => {
    searchStore.set(key, searchResults)
  }

  const whenGetProductFormCreateVM = () => {
    vm = promotionFormCreateVM(key)
  }
})
