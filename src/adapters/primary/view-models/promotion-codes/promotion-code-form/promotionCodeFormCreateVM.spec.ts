import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import {
  Field,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { ReductionType } from '@core/entities/promotion'
import {
  CreatePromotionCodeDTO,
  PromotionScope
} from '@core/entities/promotionCode'
import { PromotionScopeChoiceVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormGetVM'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  express
} from '@utils/testData/deliveryMethods'
import { DeliveryMethod } from '@core/entities/order'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import {
  PromotionCodeFormCreateVM,
  promotionCodeFormCreateVM
} from './promotionCodeFormCreateVM'

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

const availableScopeChoices: Array<PromotionScopeChoiceVM> = [
  {
    scope: PromotionScope.Products,
    text: 'Produits'
  },
  {
    scope: PromotionScope.Delivery,
    text: 'Livraison'
  }
]

describe('Promotion code form create VM', () => {
  let deliveryMethodStore: any
  let formStore: any
  let vm: PromotionCodeFormCreateVM
  const key = 'create-promotion-code-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryMethodStore = useDeliveryMethodStore()
    formStore = useFormStore()
    whenGetPromotionCodeFormCreateVM()
    givenAvailableDeliveryMethods([
      clickAndCollect,
      deliveryInRelayPoint,
      express
    ])
  })
  describe('Promotion code VM', () => {
    describe('VM initialization', () => {
      const expected = {
        code: '',
        scope: PromotionScope.Products,
        reductionType: ReductionType.Fixed,
        amount: undefined,
        startDate: undefined,
        endDate: undefined,
        maximumUsage: undefined,
        minimumAmount: undefined,
        deliveryMethodUuid: undefined
      }
      const fields = [
        { field: 'code' },
        { field: 'reductionType' },
        { field: 'scope' },
        { field: 'amount' },
        { field: 'startDate' },
        { field: 'endDate' },
        { field: 'maximumUsage' },
        { field: 'minimumAmount' },
        { field: 'deliveryMethodUuid' }
      ]
      describe.each(fields)('For promotion code', ({ field }) => {
        it(`should initialize ${field}"`, () => {
          const expectedField: Field<any> = {
            value: expected[field as keyof typeof expected],
            canEdit: true
          }
          expect(vm.get(field)).toStrictEqual(expectedField)
        })
        it(`should save the ${field} value in form store`, () => {
          expect(formStore.get(key)[field]).toStrictEqual(
            expected[field as keyof typeof expected]
          )
        })
      })
      describe('Delivery method choices', () => {
        it('should provide all delivery methods', () => {
          expect(vm.getAvailableDeliveryMethods()).toStrictEqual([
            {
              uuid: clickAndCollect.uuid,
              name: clickAndCollect.name
            },
            {
              uuid: deliveryInRelayPoint.uuid,
              name: deliveryInRelayPoint.name
            },
            {
              uuid: express.uuid,
              name: express.name
            }
          ])
        })
      })
      describe('Validation', () => {
        describe('Display validate', () => {
          it('should always display the validate button', () => {
            expect(vm.getDisplayValidate()).toBe(true)
          })
        })
        describe('Can validate', () => {
          it('should not allow to validate', () => {
            expect(vm.getCanValidate()).toBe(false)
          })
        })
      })
    })
    describe('Fields update', () => {
      describe.each([
        { field: 'code', value: 'NEW_CODE', expectedValue: 'NEW_CODE' },
        {
          field: 'scope',
          value: PromotionScope.Delivery,
          expectedValue: PromotionScope.Delivery
        },
        { field: 'amount', value: '10', expectedValue: '10' },
        { field: 'startDate', value: '123456789', expectedValue: '123456789' },
        { field: 'endDate', value: '987654321', expectedValue: '987654321' },
        { field: 'maximumUsage', value: '250', expectedValue: '250' },
        {
          field: 'minimumAmount',
          value: '80',
          expectedValue: '80'
        },
        {
          field: 'deliveryMethodUuid',
          value: deliveryInRelayPoint.uuid,
          expectedValue: deliveryInRelayPoint.uuid
        }
      ])('Simple fields', ({ field, value, expectedValue }) => {
        beforeEach(() => {
          vm.set(field, value)
        })
        it(`should have ${field} to be "${expectedValue}"`, () => {
          const expectedField: Field<any> = {
            value: expectedValue,
            canEdit: true
          }
          expect(vm.get(field)).toStrictEqual(expectedField)
        })
        it(`should save the ${field} value in form store`, () => {
          expect(formStore.get(key)[field]).toStrictEqual(expectedValue)
        })
      })
    })
    describe('Update reduction type', () => {
      beforeEach(() => {
        vm.set('amount', '10')
        vm.set('reductionType', ReductionType.Percentage)
      })
      it('should have field to match new value', () => {
        const expectedField: Field<any> = {
          value: ReductionType.Percentage,
          canEdit: true
        }
        expect(vm.get('reductionType')).toStrictEqual(expectedField)
      })
      it('should save the reduction type value in form store', () => {
        expect(formStore.get(key)['reductionType']).toStrictEqual(
          ReductionType.Percentage
        )
      })
      it('should reset the amount', () => {
        expect(formStore.get(key)['amount']).toBe(undefined)
      })
    })
  })
  describe('Type choices', () => {
    it('should provide available type choices', () => {
      expect(vm.getAvailableTypeChoices()).toStrictEqual(availableTypeChoices)
    })
  })
  describe('Scope choices', () => {
    it('should provide available scope choices', () => {
      expect(vm.getAvailableScopeChoices()).toStrictEqual(availableScopeChoices)
    })
  })

  describe('Validation', () => {
    it('should allow to validate if required fields are filled', () => {
      vm.set('code', 'NEW_CODE')
      vm.set('amount', '15')
      expect(vm.getCanValidate()).toBe(true)
    })
  })

  describe('DTO', () => {
    it('should return the dto for percentage reduction', () => {
      const expectedDto: CreatePromotionCodeDTO = {
        code: 'TEST_CODE',
        reductionType: ReductionType.Percentage,
        scope: PromotionScope.Products,
        amount: 20,
        startDate: 456789465,
        endDate: 74182963,
        conditions: {
          maximumUsage: 25,
          minimumAmount: 5000,
          deliveryMethodUuid: express.uuid
        }
      }
      vm.set('code', expectedDto.code)
      vm.set('reductionType', expectedDto.reductionType)
      vm.set('scope', expectedDto.scope)
      vm.set('amount', expectedDto.amount.toString())
      vm.set('startDate', expectedDto.startDate)
      vm.set('endDate', expectedDto.endDate)
      vm.set('maximumUsage', expectedDto.conditions.maximumUsage!.toString())
      vm.set('minimumAmount', '50')
      vm.set('deliveryMethodUuid', expectedDto.conditions.deliveryMethodUuid)
      expect(vm.getDto()).toStrictEqual(expectedDto)
    })
    it('should return the dto for fixed reduction', () => {
      const expectedDto: CreatePromotionCodeDTO = {
        code: 'TEST_CODE',
        reductionType: ReductionType.Fixed,
        scope: PromotionScope.Products,
        amount: 1000,
        startDate: 741852963,
        endDate: 9638271,
        conditions: {
          maximumUsage: 42,
          minimumAmount: 10000,
          deliveryMethodUuid: express.uuid
        }
      }
      vm.set('code', expectedDto.code)
      vm.set('reductionType', expectedDto.reductionType)
      vm.set('scope', expectedDto.scope)
      vm.set('amount', '10')
      vm.set('startDate', expectedDto.startDate)
      vm.set('endDate', expectedDto.endDate)
      vm.set('maximumUsage', expectedDto.conditions.maximumUsage!.toString())
      vm.set('minimumAmount', '100')
      vm.set('deliveryMethodUuid', expectedDto.conditions.deliveryMethodUuid)
      expect(vm.getDto()).toStrictEqual(expectedDto)
    })
  })

  const givenAvailableDeliveryMethods = (
    deliveryMethods: Array<DeliveryMethod>
  ) => {
    deliveryMethodStore.items = deliveryMethods
  }

  const whenGetPromotionCodeFormCreateVM = () => {
    vm = promotionCodeFormCreateVM(key)
  }
})
