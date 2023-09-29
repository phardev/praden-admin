import { ReductionType } from '@core/entities/promotion'
import { useProductStore } from '@store/productStore'
import {
  Field,
  PromotionProductItemVM
} from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { anaca3Minceur, calmosine, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useFormStore } from '@store/formStore'
import { Timestamp } from '@core/types/types'
import { usePromotionStore } from '@store/promotionStore'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import {
  GetPromotionVM,
  getPromotionVM
} from '@adapters/primary/view-models/promotions/get-promotion/getPromotionVM'
import {
  dolodentVM,
  availableTypeChoices
} from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM.spec'
import { baby, dents, minceur } from '@utils/testData/categories'
import { useCategoryStore } from '@store/categoryStore'

describe('Get promotion VM', () => {
  let formStore: any
  let promotionStore: any
  let productStore: any
  let categoryStore: any
  const key = 'testRoute'
  let vm: GetPromotionVM

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
    promotionStore.current = promotionPercentageDolodent
    categoryStore = useCategoryStore()
    categoryStore.items = [dents, baby, minceur]
    vm = getPromotionVM(key)
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
          canEdit: false
        }
        expect(vm.type).toStrictEqual(expectedField)
      })
      it('should save fixed choice in form store', () => {
        expect(formStore.get(key).type).toBe(ReductionType.Percentage)
      })
    })
    describe('Name field', () => {
      it('should get the promotion name', () => {
        const expectedField: Field<string> = {
          value: promotionPercentageDolodent.name,
          canEdit: false
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
      it('should give the amount', () => {
        const expectedField: Field<string | undefined> = {
          value: promotionPercentageDolodent.amount.toString(),
          canEdit: false
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
          canEdit: false
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
          canEdit: false
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
          value: [],
          canEdit: false
        }
        expect(vm.availableProducts).toStrictEqual(expectedField)
      })
    })
    describe('Products added', () => {
      it('should have previously added products', () => {
        const expectedField: Field<Array<PromotionProductItemVM>> = {
          value: [dolodentVM],
          canEdit: false
        }
        expect(vm.products).toStrictEqual(expectedField)
      })
      it('should save the value in the form store', () => {
        expect(formStore.get(key).products).toStrictEqual([dolodent.cip13])
      })
    })
  })
  describe('Validation', () => {
    it('should not allow to validate', () => {
      expect(vm.canValidate).toBeFalsy()
    })
    it('should not display validate', () => {
      expect(vm.displayValidate).toBeFalsy()
    })
  })
  describe('There is no current promotion', () => {
    beforeEach(() => {
      promotionStore.current = undefined
      vm = getPromotionVM('test')
    })
    it('should initialize fixed type', () => {
      const expectedField: Field<ReductionType> = {
        value: ReductionType.Fixed,
        canEdit: false
      }
      expect(vm.type).toStrictEqual(expectedField)
    })
    it('should initialize empty name', () => {
      const expectedField: Field<string> = {
        value: '',
        canEdit: false
      }
      expect(vm.name).toStrictEqual(expectedField)
    })
    it('should initialize undefined amount', () => {
      const expectedField: Field<string | undefined> = {
        value: undefined,
        canEdit: false
      }
      expect(vm.amount).toStrictEqual(expectedField)
    })
    it('should initialize undefined start date', () => {
      const expectedField: Field<Timestamp | undefined> = {
        value: undefined,
        canEdit: false
      }
      expect(vm.startDate).toStrictEqual(expectedField)
    })
    it('should initialize undefined end date', () => {
      const expectedField: Field<Timestamp | undefined> = {
        value: undefined,
        canEdit: false
      }
      expect(vm.endDate).toStrictEqual(expectedField)
    })
    it('should initialize no products', () => {
      const expectedField: Field<Array<PromotionProductItemVM>> = {
        value: [],
        canEdit: false
      }
      expect(vm.products).toStrictEqual(expectedField)
    })
  })
})
