import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { useProductStore } from '@store/productStore'
import {
  CreatePromotionVM,
  createPromotionVM,
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { Product } from '@core/entities/product'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useSearchStore } from '@store/searchStore'
import { useFormStore } from '@store/formStore'
import { Timestamp } from '@core/types/types'

export const availableTypeChoices: Array<TypeChoiceVM> = [
  {
    type: ReductionType.Fixed,
    text: 'Euros'
  },
  {
    type: ReductionType.Percentage,
    text: 'Pourcentage'
  }
]

export const anaca3VM: PromotionProductItemVM = {
  name: anaca3Minceur.name,
  reference: anaca3Minceur.cip13,
  category: '',
  laboratory: anaca3Minceur.laboratory
}

export const calmosineVM: PromotionProductItemVM = {
  name: calmosine.name,
  reference: calmosine.cip13,
  category: '',
  laboratory: calmosine.laboratory
}

export const dolodentVM: PromotionProductItemVM = {
  name: dolodent.name,
  reference: dolodent.cip13,
  category: '',
  laboratory: dolodent.laboratory
}

describe('Create promotion VM', () => {
  let formStore: any
  let productStore: any
  let searchStore: any
  const key = 'testRoute'
  let vm: CreatePromotionVM

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    productStore = useProductStore()
    searchStore = useSearchStore()
    vm = createPromotionVM(key)
  })
  describe('Initial VM', () => {
    describe('Type choices', () => {
      it('should provide available type choices', () => {
        expect(vm.availableTypeChoices).toStrictEqual(availableTypeChoices)
      })
    })
    describe('Type selected', () => {
      it('should set fixed choice', () => {
        const expectedField: Field<ReductionType> = {
          value: ReductionType.Fixed,
          canEdit: true
        }
        expect(vm.type).toStrictEqual(expectedField)
      })
      it('should save fixed choice in form store', () => {
        expect(formStore.get(key).type).toBe(ReductionType.Fixed)
      })
    })
    describe('Name field', () => {
      it('should have an empty name', () => {
        const expectedField: Field<string> = {
          value: '',
          canEdit: true
        }
        expect(vm.name).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual('')
      })
    })
    describe('Amount field', () => {
      it('should have an undefined amount', () => {
        const expectedField: Field<string | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.amount).toStrictEqual(expectedField)
      })
      it('should save the amount value in form store', () => {
        expect(formStore.get(key).amount).toBeUndefined()
      })
    })
    describe('Start date field', () => {
      it('should have an undefined start date', () => {
        const expectedField: Field<Timestamp | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.startDate).toStrictEqual(expectedField)
      })
      it('should save the start date value in form store', () => {
        expect(formStore.get(key).startDate).toBeUndefined()
      })
    })
    describe('End date field', () => {
      it('should have an undefined end date', () => {
        const expectedField: Field<Timestamp | undefined> = {
          value: undefined,
          canEdit: true
        }
        expect(vm.endDate).toStrictEqual(expectedField)
      })
      it('should save the end date value in form store', () => {
        expect(formStore.get(key).endDate).toBeUndefined()
      })
    })
    describe('Available products', () => {
      it('should have product headers', () => {
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
        expect(vm.productsHeaders).toStrictEqual(expectedProductsHeader)
      })
      it('should have all products available for selection', () => {
        productStore.items = [dolodent, anaca3Minceur, calmosine]
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, anaca3VM, calmosineVM],
          canEdit: true
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
      })
      it('should use filter result if there is one', () => {
        productStore.items = [dolodent, anaca3Minceur, calmosine]
        searchStore.set(key, [dolodent, calmosine])
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, calmosineVM],
          canEdit: true
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
      })
    })
    describe('Products added', () => {
      it('should not have any product added', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [],
          canEdit: true
        }
        expect(vm.products).toStrictEqual(expectedField)
      })
      it('should save the value in the form store', () => {
        expect(formStore.get(key).products).toStrictEqual([])
      })
    })
  })
  describe('Update type', () => {
    it('should update type value in form store', () => {
      vm.setType(ReductionType.Percentage)
      expect(formStore.get(key).type).toStrictEqual(ReductionType.Percentage)
    })
    it('should update name field', () => {
      vm.setType(ReductionType.Percentage)
      const expectedField: Field<string> = {
        value: ReductionType.Percentage,
        canEdit: true
      }
      expect(vm.type).toStrictEqual(expectedField)
    })
    it('should reset amount field', () => {
      vm.setAmount('7')
      vm.setType(ReductionType.Percentage)
      const expectedField: Field<number | undefined> = {
        value: undefined,
        canEdit: true
      }
      expect(vm.amount).toStrictEqual(expectedField)
    })
  })
  describe('Update name', () => {
    it('should update name value in form store', () => {
      vm.setName('test')
      expect(formStore.get(key).name).toStrictEqual('test')
    })
    it('should update name field', () => {
      vm.setName('test')
      const expectedField: Field<string> = {
        value: 'test',
        canEdit: true
      }
      expect(vm.name).toStrictEqual(expectedField)
    })
  })
  describe('Update amount', () => {
    it('should update amount value in form store', () => {
      vm.setAmount('12')
      expect(formStore.get(key).amount).toBe('12')
    })
    it('should update amount field', () => {
      vm.setAmount('12')
      const expectedField: Field<string | undefined> = {
        value: '12',
        canEdit: true
      }
      expect(vm.amount).toStrictEqual(expectedField)
    })
  })
  describe('Update start date', () => {
    it('should update start date value in form store', () => {
      vm.setStartDate(123456789)
      expect(formStore.get(key).startDate).toStrictEqual(123456789)
    })
    it('should update start date field', () => {
      vm.setStartDate(123456789)
      const expectedField: Field<Timestamp | undefined> = {
        value: 123456789,
        canEdit: true
      }
      expect(vm.startDate).toStrictEqual(expectedField)
    })
  })
  describe('Update end date', () => {
    it('should update end date value in form store', () => {
      vm.setEndDate(123456789)
      expect(formStore.get(key).endDate).toStrictEqual(123456789)
    })
    it('should update end date field', () => {
      vm.setEndDate(123456789)
      const expectedField: Field<Timestamp | undefined> = {
        value: 123456789,
        canEdit: true
      }
      expect(vm.endDate).toStrictEqual(expectedField)
    })
  })
  describe('Multiple updates', () => {
    it('should update type and name', () => {
      vm.setType(ReductionType.Percentage)
      vm.setName('test')
      expect(formStore.get(key)).toEqual(
        expect.objectContaining({
          name: 'test',
          type: ReductionType.Percentage
        })
      )
    })
  })
  describe('Add products', () => {
    describe('In one step', () => {
      const selectedProducts = [dolodent.cip13, anaca3Minceur.cip13]
      beforeEach(() => {
        productStore.items = [dolodent, anaca3Minceur, calmosine]
        vm.addProducts(selectedProducts)
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual(selectedProducts)
      })
      it('should get all products vm', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, anaca3VM],
          canEdit: true
        }
        expect(vm.products).toStrictEqual(expectedField)
      })
      it('should remove products from available selection', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [calmosineVM],
          canEdit: true
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
      })
    })
    describe('In multiple steps', () => {
      const selectedProducts = [dolodent.cip13, anaca3Minceur.cip13]
      beforeEach(() => {
        productStore.items = [dolodent, anaca3Minceur]
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
        expect(vm.products).toStrictEqual(expectedField)
      })
    })
  })
  describe('Remove products', () => {
    beforeEach(() => {
      productStore.items = [dolodent, anaca3Minceur, calmosine]
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
        expect(vm.products).toStrictEqual(expectedField)
      })
      it('should remove products from available selection', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM],
          canEdit: true
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
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
        expect(vm.products).toStrictEqual(expectedField)
      })
    })
  })
  describe('Validation', () => {
    beforeEach(() => {
      vm.setName('Test')
      vm.setAmount('12')
      vm.addProducts([dolodent.cip13])
    })
    describe('Can validate', () => {
      it('should allow to validate', () => {
        expect(vm.canValidate).toBeTruthy()
      })
    })
    describe('Can not validate', () => {
      it('should not allow to validate if there is no name', () => {
        vm.setName('')
        expect(vm.canValidate).toBeFalsy()
      })
      it('should not allow to validate if there is no amount', () => {
        vm.setAmount(undefined)
        expect(vm.canValidate).toBeFalsy()
      })
      it('should not allow to validate if there is no product selected', () => {
        vm.removeProducts([dolodent.cip13])
        expect(vm.canValidate).toBeFalsy()
      })
    })
    it('should display validate button any time', () => {
      expect(vm.displayValidate).toBeTruthy()
    })
  })
  describe('Dto', () => {
    it('should prepare the promotion dto', () => {
      vm.setName('Test')
      vm.setAmount('1,50')
      vm.addProducts([dolodent.cip13])
      const expectedDto: CreatePromotionDTO = {
        name: 'Test',
        products: [dolodent.cip13],
        type: ReductionType.Fixed,
        amount: 150
      }
      expect(vm.dto).toStrictEqual(expectedDto)
    })
    it('should prepare another promotion dto', () => {
      vm.setType(ReductionType.Percentage)
      vm.setName('AnotherTest')
      vm.setAmount('5.5')
      vm.setStartDate(123456789)
      vm.setEndDate(987654321)
      vm.addProducts([dolodent.cip13, calmosine.cip13])
      const expectedDto: CreatePromotionDTO = {
        name: 'AnotherTest',
        products: [dolodent.cip13, calmosine.cip13],
        type: ReductionType.Percentage,
        amount: 5.5,
        startDate: 123456789,
        endDate: 987654321
      }
      expect(vm.dto).toStrictEqual(expectedDto)
    })
  })
})
