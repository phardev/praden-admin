import { createPinia, setActivePinia } from 'pinia'
import { usePromotionStore } from '@store/promotionStore'
import { baby, dents, minceur } from '@utils/testData/categories'
import {
  PromotionFormGetVM,
  promotionFormGetVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { medicaments, mumAndBaby } from '@utils/testData/categoriesDemoPraden'
import {
  Field,
  PromotionFormCreateVM,
  promotionFormCreateVM,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion,
  ReductionType
} from '@core/entities/promotion'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { Category } from '@core/entities/category'
import { useSearchStore } from '@store/searchStore'
import {
  promotionFormEditVM,
  PromotionFormEditVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormEditVM'

const anaca3VM: PromotionProductItemVM = {
  name: anaca3Minceur.name,
  reference: anaca3Minceur.cip13,
  category: minceur.name,
  laboratory: anaca3Minceur.laboratory
}

const calmosineVM: PromotionProductItemVM = {
  name: calmosine.name,
  reference: calmosine.cip13,
  category: baby.name,
  laboratory: calmosine.laboratory
}

const dolodentVM: PromotionProductItemVM = {
  name: dolodent.name,
  reference: dolodent.cip13,
  category: dents.name,
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

const editableInitialVMTests = (
  getVM: () => PromotionFormCreateVM | PromotionFormEditVM | PromotionFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, true)
}

const readOnlyInitialVMTests = (
  getVM: () => PromotionFormCreateVM | PromotionFormEditVM | PromotionFormGetVM,
  key: string,
  expectedValue: any
) => {
  return initialVMTests(getVM, key, expectedValue, false)
}

const initialVMTests = (
  getVM: () => PromotionFormCreateVM | PromotionFormEditVM | PromotionFormGetVM,
  key: string,
  expectedValue: any,
  editable: boolean
) => {
  let formStore: any
  let vm: any
  let categoryStore: any

  beforeEach(() => {
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    categoryStore.items = [medicaments, mumAndBaby, minceur]
    vm = getVM()
  })
  describe.each([
    { field: 'name', expected: expectedValue.name },
    { field: 'type', expected: expectedValue.type },
    { field: 'amount', expected: expectedValue.amount },
    { field: 'startDate', expected: expectedValue.startDate },
    { field: 'endDate', expected: expectedValue.endDate }
  ])('Initial field value', ({ field, expected }) => {
    it(`should have ${field} to be "${expected}"`, () => {
      const expectedField: Field<any> = {
        value: expected,
        canEdit: editable
      }
      expect(vm.get(field)).toStrictEqual(expectedField)
    })
    it(`should save the ${field} value in form store`, () => {
      expect(formStore.get(key)[field]).toStrictEqual(expected)
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
}

const updateVMTests = (
  getVM: () => PromotionFormCreateVM | PromotionFormEditVM | PromotionFormGetVM,
  key: string
) => {
  let formStore: any
  let vm: any
  let categoryStore: any
  let productStore: any

  beforeEach(() => {
    formStore = useFormStore()
    categoryStore = useCategoryStore()
    productStore = useProductStore()
    vm = getVM()
  })
  describe('Update type', () => {
    it('should update type value in form store', () => {
      vm.set('type', ReductionType.Percentage)
      expect(formStore.get(key).type).toStrictEqual(ReductionType.Percentage)
    })
    it('should update name field', () => {
      vm.set('type', ReductionType.Percentage)
      const expectedField: Field<string> = {
        value: ReductionType.Percentage,
        canEdit: true
      }
      expect(vm.get('type')).toStrictEqual(expectedField)
    })
    it('should reset amount field', () => {
      vm.set('amount', 7)
      vm.set('type', ReductionType.Percentage)
      const expectedField: Field<number | undefined> = {
        value: undefined,
        canEdit: true
      }
      expect(vm.get('amount')).toStrictEqual(expectedField)
    })
  })
  describe('Add products', () => {
    beforeEach(() => {
      givenExistingCategories(dents, baby, minceur)
    })
    describe('In one step', () => {
      const selectedProducts = [dolodent.cip13, anaca3Minceur.cip13]
      let expectedProducts
      beforeEach(() => {
        givenExistingProducts(dolodent, anaca3Minceur, calmosine)
        const expectedSet = new Set<string>(formStore.get(key).products)
        selectedProducts.forEach((p) => expectedSet.add(p))
        expectedProducts = [...expectedSet]
        vm.addProducts(selectedProducts)
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual(expectedProducts)
      })
      it('should get all products vm', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, anaca3VM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
      it('should remove products from available selection', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [calmosineVM],
          canEdit: true
        }
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('In multiple steps', () => {
      const selectedProducts = [dolodent.cip13, anaca3Minceur.cip13]
      beforeEach(() => {
        givenExistingProducts(dolodent, anaca3Minceur)
        vm.addProducts([dolodent.cip13])
        vm.addProducts([anaca3Minceur.cip13])
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual(selectedProducts)
      })
      it('should get all products vm', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, anaca3VM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
    })
  })
  describe('Remove products', () => {
    beforeEach(() => {
      givenExistingProducts(dolodent, anaca3Minceur, calmosine)
      givenExistingCategories(dents, baby, minceur)
      formStore.set(key, {
        products: productStore.items.map((p: Product) => p.cip13)
      })
    })
    describe('In one step', () => {
      beforeEach(() => {
        vm.removeProducts([dolodent.cip13])
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual([
          anaca3Minceur.cip13,
          calmosine.cip13
        ])
      })
      it('should get all products vm', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [anaca3VM, calmosineVM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
      it('should remove products from available selection', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM],
          canEdit: true
        }
        expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
      })
    })
    describe('In multiple steps', () => {
      beforeEach(() => {
        vm.removeProducts([dolodent.cip13])
        vm.removeProducts([anaca3Minceur.cip13])
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual([calmosine.cip13])
      })
      it('should get all products vm', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [calmosineVM],
          canEdit: true
        }
        expect(vm.getProducts()).toStrictEqual(expectedField)
      })
    })
  })
  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }
  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
  }
}

describe('Promotion form', () => {
  let promotionStore: any
  let productStore: any
  let categoryStore: any
  let searchStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    productStore = useProductStore()
    categoryStore = useCategoryStore()
    searchStore = useSearchStore()
  })
  describe('Promotion form get VM', () => {
    let vm: PromotionFormGetVM
    const key = 'get-category-form'

    describe('Initial VM for fixed promotion', () => {
      const promotion = promotionFixedMultipleProducts
      beforeEach(() => {
        givenCurrentPromotionIs(promotion)
        vm = promotionFormGetVM(key)
      })
      const expected: any = {
        name: promotion.name,
        products: [dolodent.cip13, anaca3Minceur],
        type: ReductionType.Fixed,
        amount: '1',
        startDate: 1690416000000,
        endDate: 1693094400000
      }
      readOnlyInitialVMTests(() => vm, key, expected)
    })
    describe('Initial VM for percentage promotion ', () => {
      const promotion = promotionPercentageDolodent
      beforeEach(() => {
        givenCurrentPromotionIs(promotion)
        vm = promotionFormGetVM(key)
      })
      const expected: any = {
        name: promotion.name,
        products: [dolodent.cip13],
        type: ReductionType.Percentage,
        amount: '10',
        startDate: 1690416000000,
        endDate: 1693094400000
      }
      readOnlyInitialVMTests(() => vm, key, expected)
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
  })
  describe('Promotion form create VM', () => {
    let vm: PromotionFormCreateVM
    const key = 'create-category-form'

    beforeEach(() => {
      vm = promotionFormCreateVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: '',
        products: [],
        type: ReductionType.Fixed,
        amount: undefined,
        startDate: undefined,
        endDate: undefined
      }
      editableInitialVMTests(() => vm, key, expected)
      describe('Available products', () => {
        beforeEach(() => {
          givenExistingProducts(dolodent, anaca3Minceur, calmosine)
          givenExistingCategories(dents, baby, minceur)
        })
        it('should list the available products', () => {
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [dolodentVM, anaca3VM, calmosineVM],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
        it('should use filter result if there is one', () => {
          givenExistingProducts(dolodent, anaca3Minceur, calmosine)
          searchStore.set(key, [dolodent, calmosine])
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [dolodentVM, calmosineVM],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
      })
    })
    describe('Update', () => {
      updateVMTests(() => vm, key)
    })
    describe('Validation', () => {
      beforeEach(() => {
        vm.set('name', 'Test')
        vm.set('amount', 12)
        vm.addProducts([dolodent.cip13])
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
          vm.removeProducts([dolodent.cip13])
          expect(vm.getCanValidate()).toBeFalsy()
        })
      })
      it('should display validate button any time', () => {
        expect(vm.getDisplayValidate()).toBeTruthy()
      })
    })
    describe('Dto', () => {
      it('should prepare the promotion dto', () => {
        vm.set('name', 'Test')
        vm.set('amount', 1.5)
        vm.addProducts([dolodent.cip13])
        const expectedDto: CreatePromotionDTO = {
          name: 'Test',
          products: [dolodent.cip13],
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
        vm.addProducts([dolodent.cip13, calmosine.cip13])
        const expectedDto: CreatePromotionDTO = {
          name: 'AnotherTest',
          products: [dolodent.cip13, calmosine.cip13],
          type: ReductionType.Percentage,
          amount: 5.5,
          startDate: 123456789,
          endDate: 987654321
        }
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })
  })
  describe('Promotion form edit VM', () => {
    let vm: PromotionFormEditVM
    const key = 'create-category-form'
    let promotion: Promotion

    beforeEach(() => {
      promotion = JSON.parse(JSON.stringify(promotionPercentageDolodent))
      givenCurrentPromotionIs(promotion)
      vm = promotionFormEditVM(key)
    })

    describe('Initial VM', () => {
      const expected: any = {
        name: promotionPercentageDolodent.name,
        products: [dolodent.cip13],
        type: ReductionType.Percentage,
        amount: '10',
        startDate: promotionPercentageDolodent.startDate,
        endDate: promotionPercentageDolodent.endDate
      }
      editableInitialVMTests(() => vm, key, expected)
      describe('Available products', () => {
        beforeEach(() => {
          givenExistingProducts(dolodent, anaca3Minceur, calmosine)
          givenExistingCategories(dents, baby, minceur)
        })
        it('should list the available products', () => {
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [anaca3VM, calmosineVM],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
        it('should use filter result if there is one and exclude already added products', () => {
          givenExistingProducts(dolodent, anaca3Minceur, calmosine)
          searchStore.set(key, [dolodent, calmosine])
          const expectedField: Field<Array<PromotionProductItemVM>> = {
            value: [calmosineVM],
            canEdit: true
          }
          expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
        })
      })
    })
    describe('Update', () => {
      updateVMTests(() => vm, key)
    })
    describe('Validation', () => {
      beforeEach(() => {
        vm.set('name', 'Test')
        vm.set('amount', 12)
        vm.addProducts([dolodent.cip13])
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
          vm.removeProducts([dolodent.cip13])
          expect(vm.getCanValidate()).toBeFalsy()
        })
      })
      it('should display validate button any time', () => {
        expect(vm.getDisplayValidate()).toBeTruthy()
      })
    })
    describe('Dto', () => {
      it('should prepare the promotion dto', () => {
        vm.set('name', 'Test')
        vm.set('type', ReductionType.Fixed)
        vm.set('amount', 1.5)
        vm.addProducts([dolodent.cip13])
        const expectedDto: EditPromotionDTO = {
          name: 'Test',
          products: [dolodent.cip13],
          type: ReductionType.Fixed,
          amount: 150,
          startDate: promotion.startDate,
          endDate: promotion.endDate
        }
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
      it('should prepare another promotion dto', () => {
        vm.set('type', ReductionType.Percentage)
        vm.set('name', 'AnotherTest')
        vm.set('amount', 5.5)
        vm.set('startDate', 123456789)
        vm.set('endDate', 987654321)
        vm.addProducts([dolodent.cip13, calmosine.cip13])
        const expectedDto: CreatePromotionDTO = {
          name: 'AnotherTest',
          products: [dolodent.cip13, calmosine.cip13],
          type: ReductionType.Percentage,
          amount: 5.5,
          startDate: 123456789,
          endDate: 987654321
        }
        expect(vm.getDto()).toStrictEqual(expectedDto)
      })
    })
  })

  const givenCurrentPromotionIs = (promo: Promotion) => {
    promotionStore.current = promo
  }

  const givenExistingProducts = (...products: Array<Product>) => {
    productStore.items = products
  }

  const givenExistingCategories = (...categories: Array<Category>) => {
    categoryStore.items = categories
  }
})
