import { CreatePromotionDTO, ReductionType } from '@core/entities/promotion'
import { useProductStore } from '@store/productStore'
import {
  Field,
  PromotionProductItemVM
} from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { Product } from '@core/entities/product'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useSearchStore } from '@store/searchStore'
import { useFormStore } from '@store/formStore'
import { Timestamp } from '@core/types/types'
import {
  EditPromotionVM,
  editPromotionVM
} from '@adapters/primary/view-models/promotions/edit-promotion/editPromotionVM'
import { usePromotionStore } from '@store/promotionStore'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import {
  calmosineVM,
  anaca3VM,
  dolodentVM,
  availableTypeChoices
} from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM.spec'
import { useCategoryStore } from '@store/categoryStore'
import { baby, dents, minceur } from '@utils/testData/categories'

describe('Edit promotion VM', () => {
  let formStore: any
  let promotionStore: any
  let productStore: any
  let searchStore: any
  let categoryStore: any
  const key = 'testRoute'
  let vm: EditPromotionVM

  beforeEach(() => {
    setActivePinia(createPinia())
    formStore = useFormStore()
    promotionStore = usePromotionStore()
    promotionStore.items = [
      promotionFixedMultipleProducts,
      promotionPercentageDolodent
    ]
    productStore = useProductStore()
    productStore.items = [dolodent, anaca3Minceur, calmosine]
    searchStore = useSearchStore()
    promotionStore.current = promotionPercentageDolodent
    categoryStore = useCategoryStore()
    categoryStore.items = [dents, baby, minceur]
    vm = editPromotionVM(key)
  })
  describe('Initial VM', () => {
    describe('Type choices', () => {
      it('should provide available type choices', () => {
        expect(vm.availableTypeChoices).toStrictEqual(availableTypeChoices)
      })
    })
    describe('Type selected', () => {
      it('should get the promotion selected choice', () => {
        const expectedField: Field<ReductionType> = {
          value: ReductionType.Percentage,
          canEdit: true
        }
        expect(vm.type).toStrictEqual(expectedField)
      })
      it('should save fixed choice in form store', () => {
        expect(formStore.get(key).type).toBe(ReductionType.Percentage)
      })
    })
    describe('Name field', () => {
      it('should the promotion name', () => {
        const expectedField: Field<string> = {
          value: promotionPercentageDolodent.name,
          canEdit: true
        }
        expect(vm.name).toStrictEqual(expectedField)
      })
      it('should save the name value in form store', () => {
        expect(formStore.get(key).name).toStrictEqual(
          promotionPercentageDolodent.name
        )
      })
    })
    describe('Amount field', () => {
      it('should have an undefined amount', () => {
        const expectedField: Field<string | undefined> = {
          value: promotionPercentageDolodent.amount.toString(),
          canEdit: true
        }
        expect(vm.amount).toStrictEqual(expectedField)
      })
      it('should save the amount value in form store', () => {
        expect(formStore.get(key).amount).toBe(
          promotionPercentageDolodent.amount.toString()
        )
      })
    })
    describe('Start date field', () => {
      it('should have an undefined start date', () => {
        const expectedField: Field<Timestamp | undefined> = {
          value: promotionPercentageDolodent.startDate,
          canEdit: true
        }
        expect(vm.startDate).toStrictEqual(expectedField)
      })
      it('should save the start date value in form store', () => {
        expect(formStore.get(key).startDate).toBe(
          promotionPercentageDolodent.startDate
        )
      })
    })
    describe('End date field', () => {
      it('should have an undefined end date', () => {
        const expectedField: Field<Timestamp | undefined> = {
          value: promotionPercentageDolodent.endDate,
          canEdit: true
        }
        expect(vm.endDate).toStrictEqual(expectedField)
      })
      it('should save the end date value in form store', () => {
        expect(formStore.get(key).endDate).toBe(
          promotionPercentageDolodent.endDate
        )
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
      it('should have all products available for selection without promotion products', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [anaca3VM, calmosineVM],
          canEdit: true
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
      })
      it('should use filter result if there is one', () => {
        searchStore.set(key, [dolodent, calmosine])
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [calmosineVM],
          canEdit: true
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
      })
    })
    describe('Products added', () => {
      it('should have previously added products', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM],
          canEdit: true
        }
        expect(vm.products).toStrictEqual(expectedField)
      })
      it('should save the value in the form store', () => {
        expect(formStore.get(key).products).toStrictEqual([dolodent.cip13])
      })
    })
  })
  describe('Update type', () => {
    it('should update type value in form store', () => {
      vm.setType(ReductionType.Fixed)
      expect(formStore.get(key).type).toStrictEqual(ReductionType.Fixed)
    })
    it('should update name field', () => {
      vm.setType(ReductionType.Fixed)
      const expectedField: Field<string> = {
        value: ReductionType.Fixed,
        canEdit: true
      }
      expect(vm.type).toStrictEqual(expectedField)
    })
    it('should reset amount field', () => {
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
      const selectedProducts = [anaca3Minceur.cip13]
      beforeEach(() => {
        vm.addProducts(selectedProducts)
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual([
          dolodent.cip13,
          ...selectedProducts
        ])
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
      beforeEach(() => {
        vm.addProducts([calmosine.cip13])
        vm.addProducts([anaca3Minceur.cip13])
      })
      it('should add selected products to form store', () => {
        expect(formStore.get(key).products).toStrictEqual([
          dolodent.cip13,
          calmosine.cip13,
          anaca3Minceur.cip13
        ])
      })
      it('should get all products vm', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM, calmosineVM, anaca3VM],
          canEdit: true
        }
        expect(vm.products).toStrictEqual(expectedField)
      })
    })
  })
  describe('Remove products', () => {
    beforeEach(() => {
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
      const expectedDto: CreatePromotionDTO = {
        name: promotionPercentageDolodent.name,
        products: promotionPercentageDolodent.products,
        type: promotionPercentageDolodent.type,
        amount: promotionPercentageDolodent.amount,
        startDate: promotionPercentageDolodent.startDate,
        endDate: promotionPercentageDolodent.endDate
      }
      expect(vm.dto).toStrictEqual(expectedDto)
    })
  })
  describe('There is no current promotion', () => {
    beforeEach(() => {
      promotionStore.current = undefined
      vm = editPromotionVM('test')
    })
    it('should initialize fixed type', () => {
      const expectedField: Field<ReductionType> = {
        value: ReductionType.Fixed,
        canEdit: true
      }
      expect(vm.type).toStrictEqual(expectedField)
    })
    it('should initialize empty name', () => {
      const expectedField: Field<string> = {
        value: '',
        canEdit: true
      }
      expect(vm.name).toStrictEqual(expectedField)
    })
    it('should initialize undefined amount', () => {
      const expectedField: Field<string | undefined> = {
        value: undefined,
        canEdit: true
      }
      expect(vm.amount).toStrictEqual(expectedField)
    })
    it('should initialize undefined start date', () => {
      const expectedField: Field<Timestamp | undefined> = {
        value: undefined,
        canEdit: true
      }
      expect(vm.startDate).toStrictEqual(expectedField)
    })
    it('should initialize undefined end date', () => {
      const expectedField: Field<Timestamp | undefined> = {
        value: undefined,
        canEdit: true
      }
      expect(vm.endDate).toStrictEqual(expectedField)
    })
    it('should initialize no products', () => {
      const expectedField: Field<Array<PromotionProductItemVM>> = {
        value: [],
        canEdit: true
      }
      expect(vm.products).toStrictEqual(expectedField)
    })
  })
})
