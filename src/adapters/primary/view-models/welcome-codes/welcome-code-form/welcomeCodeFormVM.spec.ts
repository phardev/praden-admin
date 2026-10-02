import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useWelcomeCodeStore } from '@store/welcomeCodeStore'
import {
  clickAndCollect,
  deliveryInRelayPoint
} from '@utils/testData/deliveryMethods'
import {
  fiveEuroWelcomeCode,
  freeRelayDeliveryWelcomeCode,
  tenPercentWelcomeCode
} from '@utils/testData/welcomeCodes'
import { createPinia, setActivePinia } from 'pinia'
import {
  WelcomeCodeFormVM,
  WelcomeCodeValidationHint,
  welcomeCodeFormCreateVM,
  welcomeCodeFormEditVM
} from './welcomeCodeFormVM'

describe('Welcome code form VM', () => {
  const key = 'welcome-code-form'
  let vm: WelcomeCodeFormVM
  let welcomeCodeStore: ReturnType<typeof useWelcomeCodeStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    welcomeCodeStore = useWelcomeCodeStore()
    welcomeCodeStore.list([
      fiveEuroWelcomeCode,
      tenPercentWelcomeCode,
      freeRelayDeliveryWelcomeCode
    ])
    useDeliveryMethodStore().list([clickAndCollect, deliveryInRelayPoint])
  })

  const fieldsOf = (...names: Array<string>) =>
    Object.fromEntries(names.map((name) => [name, vm.get(name).value]))

  describe('Creation', () => {
    beforeEach(() => {
      vm = welcomeCodeFormCreateVM(key)
    })

    it('should start with an empty fixed discount on products', () => {
      expect(
        fieldsOf(
          'code',
          'reductionType',
          'scope',
          'amount',
          'minimumAmount',
          'deliveryMethodUuids',
          'maxWeight',
          'startDate',
          'endDate'
        )
      ).toStrictEqual({
        code: '',
        reductionType: ReductionType.Fixed,
        scope: PromotionScope.Products,
        amount: undefined,
        minimumAmount: undefined,
        deliveryMethodUuids: [],
        maxWeight: undefined,
        startDate: undefined,
        endDate: undefined
      })
    })

    it('should let every field be edited', () => {
      expect(vm.get('code')).toStrictEqual({ value: '', canEdit: true })
    })

    it('should offer the reduction types', () => {
      expect(vm.getAvailableTypeChoices()).toStrictEqual([
        { type: ReductionType.Fixed, labelKey: 'welcomeCode.types.FIXED' },
        {
          type: ReductionType.Percentage,
          labelKey: 'welcomeCode.types.PERCENTAGE'
        }
      ])
    })

    it('should offer the scopes', () => {
      expect(vm.getAvailableScopeChoices()).toStrictEqual([
        {
          scope: PromotionScope.Products,
          labelKey: 'welcomeCode.scopes.PRODUCTS'
        },
        {
          scope: PromotionScope.Delivery,
          labelKey: 'welcomeCode.scopes.DELIVERY'
        }
      ])
    })

    it('should offer the delivery methods', () => {
      expect(vm.getAvailableDeliveryMethods()).toStrictEqual([
        { uuid: clickAndCollect.uuid, name: clickAndCollect.name },
        { uuid: deliveryInRelayPoint.uuid, name: deliveryInRelayPoint.name }
      ])
    })

    it('should forget the amount when the reduction type changes', () => {
      vm.set('amount', 5)
      vm.set('reductionType', ReductionType.Percentage)
      expect(fieldsOf('reductionType', 'amount')).toStrictEqual({
        reductionType: ReductionType.Percentage,
        amount: undefined
      })
    })

    it('should suggest a maximum weight for a delivery discount', () => {
      vm.set('scope', PromotionScope.Delivery)
      expect(fieldsOf('scope', 'maxWeight')).toStrictEqual({
        scope: PromotionScope.Delivery,
        maxWeight: 5
      })
    })

    it('should forget the maximum weight for a products discount', () => {
      vm.set('scope', PromotionScope.Delivery)
      vm.set('scope', PromotionScope.Products)
      expect(fieldsOf('scope', 'maxWeight')).toStrictEqual({
        scope: PromotionScope.Products,
        maxWeight: undefined
      })
    })

    it('should explain what is missing before any input', () => {
      expect(vm.getValidationHints()).toStrictEqual([
        WelcomeCodeValidationHint.CodeRequired,
        WelcomeCodeValidationHint.AmountMustBePositive
      ])
    })

    it('should refuse a percentage above 100', () => {
      vm.set('code', 'HELLO')
      vm.set('reductionType', ReductionType.Percentage)
      vm.set('amount', 101)
      expect(vm.getValidationHints()).toStrictEqual([
        WelcomeCodeValidationHint.PercentageTooHigh
      ])
    })

    it('should refuse an end date that is not after the start date', () => {
      vm.set('code', 'HELLO')
      vm.set('amount', 5)
      vm.set('startDate', fiveEuroWelcomeCode.endDate)
      vm.set('endDate', fiveEuroWelcomeCode.startDate)
      expect(vm.getValidationHints()).toStrictEqual([
        WelcomeCodeValidationHint.EndDateMustFollowStartDate
      ])
    })

    it('should not be validable while something is missing', () => {
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should be validable once the code and the amount are given', () => {
      vm.set('code', 'HELLO')
      vm.set('amount', 5)
      expect(vm.getCanValidate()).toBe(true)
    })

    it('should not be validable while saving', () => {
      vm.set('code', 'HELLO')
      vm.set('amount', 5)
      welcomeCodeStore.startSaving()
      expect(vm.getCanValidate()).toBe(false)
    })

    it('should give a fixed discount in cents with its conditions', () => {
      vm.set('code', ' HELLO5 ')
      vm.set('amount', fiveEuroWelcomeCode.amount / 100)
      vm.set(
        'minimumAmount',
        fiveEuroWelcomeCode.conditions.minimumAmount! / 100
      )
      vm.set('startDate', fiveEuroWelcomeCode.startDate)
      vm.set('endDate', fiveEuroWelcomeCode.endDate)
      expect(vm.getDto()).toStrictEqual({
        code: 'HELLO5',
        reductionType: ReductionType.Fixed,
        scope: PromotionScope.Products,
        amount: fiveEuroWelcomeCode.amount,
        conditions: {
          minimumAmount: fiveEuroWelcomeCode.conditions.minimumAmount
        },
        startDate: fiveEuroWelcomeCode.startDate,
        endDate: fiveEuroWelcomeCode.endDate
      })
    })

    it('should give a delivery percentage with its delivery conditions', () => {
      vm.set('code', 'HELLO')
      vm.set('scope', PromotionScope.Delivery)
      vm.set('reductionType', ReductionType.Percentage)
      vm.set('amount', freeRelayDeliveryWelcomeCode.amount)
      vm.set('deliveryMethodUuids', [deliveryInRelayPoint.uuid])
      expect(vm.getDto()).toStrictEqual({
        code: 'HELLO',
        reductionType: ReductionType.Percentage,
        scope: PromotionScope.Delivery,
        amount: freeRelayDeliveryWelcomeCode.amount,
        conditions: {
          deliveryMethodUuids: [deliveryInRelayPoint.uuid],
          maxWeight: freeRelayDeliveryWelcomeCode.conditions.maxWeight
        }
      })
    })
  })

  describe('Edition', () => {
    it('should start from a fixed discount shown in euros', () => {
      vm = welcomeCodeFormEditVM(key, fiveEuroWelcomeCode.uuid)
      expect(
        fieldsOf(
          'code',
          'reductionType',
          'scope',
          'amount',
          'minimumAmount',
          'deliveryMethodUuids',
          'maxWeight',
          'startDate',
          'endDate'
        )
      ).toStrictEqual({
        code: fiveEuroWelcomeCode.code,
        reductionType: fiveEuroWelcomeCode.reductionType,
        scope: fiveEuroWelcomeCode.scope,
        amount: fiveEuroWelcomeCode.amount / 100,
        minimumAmount: fiveEuroWelcomeCode.conditions.minimumAmount! / 100,
        deliveryMethodUuids: [],
        maxWeight: undefined,
        startDate: fiveEuroWelcomeCode.startDate,
        endDate: fiveEuroWelcomeCode.endDate
      })
    })

    it('should start from a delivery percentage shown as is with its weight in kilograms', () => {
      vm = welcomeCodeFormEditVM(key, freeRelayDeliveryWelcomeCode.uuid)
      expect(
        fieldsOf('amount', 'deliveryMethodUuids', 'maxWeight')
      ).toStrictEqual({
        amount: freeRelayDeliveryWelcomeCode.amount,
        deliveryMethodUuids:
          freeRelayDeliveryWelcomeCode.conditions.deliveryMethodUuids,
        maxWeight: freeRelayDeliveryWelcomeCode.conditions.maxWeight! / 1000
      })
    })

    it('should give back an unchanged welcome code as it was', () => {
      vm = welcomeCodeFormEditVM(key, freeRelayDeliveryWelcomeCode.uuid)
      expect(vm.getDto()).toStrictEqual({
        code: freeRelayDeliveryWelcomeCode.code,
        reductionType: freeRelayDeliveryWelcomeCode.reductionType,
        scope: freeRelayDeliveryWelcomeCode.scope,
        amount: freeRelayDeliveryWelcomeCode.amount,
        conditions: freeRelayDeliveryWelcomeCode.conditions,
        startDate: freeRelayDeliveryWelcomeCode.startDate
      })
    })

    it('should tell that the welcome code to edit is not loaded', () => {
      vm = welcomeCodeFormEditVM(key, 'unknown')
      expect(vm.isReady()).toBe(false)
    })

    it('should tell that the welcome code to edit is loaded', () => {
      vm = welcomeCodeFormEditVM(key, fiveEuroWelcomeCode.uuid)
      expect(vm.isReady()).toBe(true)
    })
  })
})
