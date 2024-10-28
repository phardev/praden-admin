import { createPinia, setActivePinia } from 'pinia'
import { usePromotionStore } from '@store/promotionStore'
import { dents, minceur } from '@utils/testData/categories'
import {
  PromotionFormGetVM,
  promotionFormGetVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { useFormStore } from '@store/formStore'
import {
  Field,
  PromotionProductItemVM,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { Promotion, ReductionType } from '@core/entities/promotion'
import {
  promotionFixedMultipleProducts,
  promotionPercentageDolodent
} from '@utils/testData/promotions'
import { anaca3Minceur, dolodent, ultraLevure } from '@utils/testData/products'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'

const anaca3VM: PromotionProductItemVM = {
  uuid: anaca3Minceur.uuid,
  name: anaca3Minceur.name,
  reference: anaca3Minceur.ean13,
  category: minceur.name,
  laboratory: anaca3Minceur.laboratory
}

const ultraLevureVM: PromotionProductItemVM = {
  uuid: ultraLevure.uuid,
  name: ultraLevure.name,
  reference: ultraLevure.ean13,
  category: ultraLevure.category.name,
  laboratory: ultraLevure.laboratory
}

const dolodentVM: PromotionProductItemVM = {
  uuid: dolodent.uuid,
  name: dolodent.name,
  reference: dolodent.ean13,
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

describe('Promotion form get VM', () => {
  let promotionStore: any
  let formStore: any
  let vm: PromotionFormGetVM
  const key = 'get-promotion-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionStore = usePromotionStore()
    formStore = useFormStore()
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
      describe.each([
        {
          promotion: promotionFixedMultipleProducts,
          expectedFields: {
            name: promotionFixedMultipleProducts.name,
            products: [ultraLevureVM, anaca3VM],
            availableProducts: [],
            type: ReductionType.Fixed,
            amount: '1',
            startDate: 1690416000000,
            endDate: 1693094400000
          }
        },
        {
          promotion: promotionPercentageDolodent,
          expectedFields: {
            name: promotionPercentageDolodent.name,
            products: [dolodentVM],
            availableProducts: [],
            type: ReductionType.Percentage,
            amount: '10',
            startDate: 1690416000000,
            endDate: 1693094400000
          }
        }
      ])('For promotion', ({ promotion, expectedFields }) => {
        beforeEach(() => {
          givenCurrentPromotionIs(promotion)
          whenGetProductFormGetVM()
        })
        describe.each(basicFields)(
          'Basic fields initialization',
          ({ field }) => {
            it(`should initialize ${field}"`, () => {
              const expectedField: Field<any> = {
                value: expectedFields[field],
                canEdit: false
              }
              expect(vm.get(field)).toStrictEqual(expectedField)
            })
            it(`should save the ${field} value in form store`, () => {
              expect(formStore.get(key)[field]).toStrictEqual(
                expectedFields[field]
              )
            })
          }
        )
        describe('Available products', () => {
          it('should not have available products', () => {
            const expectedField: Field<any> = {
              value: [],
              canEdit: false
            }
            expect(vm.getAvailableProducts()).toStrictEqual(expectedField)
          })
        })
        describe('Products', () => {
          it('should get products vm', () => {
            const expectedField: Field<any> = {
              value: expectedFields.products,
              canEdit: false
            }
            expect(vm.getProducts()).toStrictEqual(expectedField)
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
  })

  const givenCurrentPromotionIs = (promo: Promotion) => {
    promotionStore.current = promo
  }

  const whenGetProductFormGetVM = () => {
    vm = promotionFormGetVM(key)
  }
})
