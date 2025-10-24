import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  PromotionFormEditVM,
  promotionFormEditVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormEditVM'
import { Product } from '@core/entities/product'
import {
  CreatePromotionDTO,
  Promotion,
  ReductionType
} from '@core/entities/promotion'
import { useFormStore } from '@store/formStore'
import { useProductStore } from '@store/productStore'
import { usePromotionStore } from '@store/promotionStore'
import { useSearchStore } from '@store/searchStore'
import {
  anaca3Minceur,
  calmosine,
  dolodent,
  ultraLevure
} from '@utils/testData/products'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { createPinia, setActivePinia } from 'pinia'

const anaca3VM: PromotionProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  categories: anaca3Minceur.categories.map((c) => c.name),
  laboratory: anaca3Minceur.laboratory!.name
}

const ultraLevureVM: PromotionProductItemVM = {
  uuid: ultraLevure.uuid,
  name: ultraLevure.name,
  reference: ultraLevure.ean13,
  categories: ultraLevure.categories.map((c) => c.name),
  laboratory: ultraLevure.laboratory!.name
}

const dolodentVM: PromotionProductItemVM = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  reference: dolodent.ean13,
  categories: dolodent.categories.map((c) => c.name),
  laboratory: dolodent.laboratory!.name
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

describe('Promotion form edit VM', () => {
  let formStore: any
  let vm: PromotionFormEditVM
  let productStore: any
  let searchStore: any
  const key = 'create-promotion-form'
  let currentPromotion: Promotion
  let promotionStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    productStore = useProductStore()
    searchStore = useSearchStore()
    promotionStore = usePromotionStore()
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
        name: promotionFixedMultipleProducts.name,
        type: ReductionType.Fixed,
        amount: '1',
        startDate: promotionFixedMultipleProducts.startDate,
        endDate: promotionFixedMultipleProducts.endDate
      }
      beforeEach(() => {
        givenCurrentPromotionIs(promotionFixedMultipleProducts)
        whenGetProductFormEditVM()
      })
      describe.each(basicFields)('Basic fields initialization', ({ field }) => {
        it(`should initialize ${field}"`, () => {
          const expectedField: Field<any> = {
            value: expectedFields[field as keyof typeof expectedFields],
            canEdit: true
          }
          expect(vm.get(field)).toStrictEqual(expectedField)
        })
        it(`should save the ${field} value in form store`, () => {
          expect(
            formStore.get(key)[field as keyof typeof expectedFields]
          ).toStrictEqual(expectedFields[field as keyof typeof expectedFields])
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
        givenCurrentPromotionIs(promotionFixedMultipleProducts)
        whenGetProductFormEditVM()
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('There is some products in the store, but not in the search results', () => {
      beforeEach(() => {
        givenExistingProducts(dolodent, anaca3Minceur)
        givenCurrentPromotionIs(promotionFixedMultipleProducts)
        whenGetProductFormEditVM()
      })
      it('should have available products without the promotion ones', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM],
          canEdit: true
        }
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('There is some products in the search result', () => {
      beforeEach(() => {
        givenExistingProducts(dolodent, anaca3Minceur)
        givenExistingSearchResult(ultraLevure)
        givenCurrentPromotionIs(promotionFixedMultipleProducts)
        whenGetProductFormEditVM()
      })
      it('should have available products without the promotion ones', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [],
          canEdit: true
        }
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('There is products already added', () => {
      describe('There is no search', () => {
        beforeEach(() => {
          givenExistingProducts(dolodent, anaca3Minceur)
          givenCurrentPromotionIs(promotionFixedMultipleProducts)
          whenGetProductFormEditVM()
          vm.addProducts([dolodent.uuid])
        })
        it('should have available products without already added products', () => {
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
      })
      describe('There is search', () => {
        beforeEach(() => {
          givenExistingSearchResult(dolodent, anaca3Minceur)
          givenCurrentPromotionIs(promotionFixedMultipleProducts)
          whenGetProductFormEditVM()
          vm.addProducts([dolodent.uuid])
        })
        it('should have available products without already added products', () => {
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [],
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
        givenCurrentPromotionIs(promotionFixedMultipleProducts)
        whenGetProductFormEditVM()
        vm.addProducts([dolodent.uuid, anaca3Minceur.uuid])
      })
      it('should add the products', () => {
        const expectedField: Field<Array<Product>> = {
          value: [ultraLevure, anaca3Minceur, dolodent],
          canEdit: true
        }
        expect(vm.get('products')).toStrictEqual(expectedField)
      })
      it('should give the right products VM', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [ultraLevureVM, anaca3VM, dolodentVM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
    })
    describe('Add products from search result', () => {
      beforeEach(() => {
        givenExistingProducts()
        givenExistingSearchResult(dolodent, ultraLevure, anaca3Minceur)
        givenCurrentPromotionIs(promotionPercentageDolodent)
        whenGetProductFormEditVM()
        vm.addProducts([ultraLevure.uuid, anaca3Minceur.uuid])
      })
      it('should add the products', () => {
        const expectedField: Field<Array<Product>> = {
          value: [dolodent, ultraLevure, anaca3Minceur],
          canEdit: true
        }
        expect(vm.get('products')).toStrictEqual(expectedField)
      })
      it('should give the right products VM', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, ultraLevureVM, anaca3VM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
    })
  })
  describe('Validation', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent)
      givenCurrentPromotionIs(promotionPercentageDolodent)
      whenGetProductFormEditVM()
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
      givenCurrentPromotionIs(promotionFixedMultipleProducts)
      whenGetProductFormEditVM()
    })
    it('should prepare the promotion dto', () => {
      vm.set('name', 'Test')
      vm.set('amount', 1.5)
      vm.addProducts([dolodent.uuid])
      const expectedDto: CreatePromotionDTO = {
        name: 'Test',
        products: [ultraLevure, anaca3Minceur, dolodent],
        type: ReductionType.Fixed,
        amount: 150,
        startDate: currentPromotion.startDate,
        endDate: currentPromotion.endDate
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
        products: [ultraLevure, anaca3Minceur, dolodent, calmosine],
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

  const givenCurrentPromotionIs = (promo: Promotion) => {
    promotionStore.current = promo
    currentPromotion = promo
  }

  const whenGetProductFormEditVM = () => {
    vm = promotionFormEditVM(key)
  }
})
