import { PromotionScopeChoiceVM } from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormGetVM'
import {
  Field,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { DeliveryMethod } from '@core/entities/order'
import { ReductionType } from '@core/entities/promotion'
import {
  CreatePromotionCodeDTO,
  PromotionCode,
  PromotionScope
} from '@core/entities/promotionCode'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useFormStore } from '@store/formStore'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  express
} from '@utils/testData/deliveryMethods'
import {
  deliveryPromotionCode,
  fifteenPercentIfMiniumAmountPromotionCode,
  fifteenPercentPromotionCode,
  limitedInTimePromotionCode,
  limitedPromotionCode,
  tenEuroFixedPromotionCode
} from '@utils/testData/promotionCodes'
import { createPinia, setActivePinia } from 'pinia'
import {
  PromotionCodeFormEditVM,
  promotionCodeFormEditVM
} from './promotionCodeFormEditVM'

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

describe('Promotion code form edit VM', () => {
  let promotionCodeStore: any
  let deliveryMethodStore: any
  let formStore: any
  let vm: PromotionCodeFormEditVM
  const key = 'edit-promotion-code-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
    deliveryMethodStore = useDeliveryMethodStore()
    formStore = useFormStore()
    givenAvailableDeliveryMethods([
      clickAndCollect,
      deliveryInRelayPoint,
      express
    ])
  })

  describe('Promotion code VM', () => {
    describe('VM initialization', () => {
      const basicFields = [
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
      describe.each([
        {
          promotionCode: tenEuroFixedPromotionCode,
          availableDeliveryMethods: [clickAndCollect],
          expectedAvailableDeliveryMethods: [
            {
              uuid: clickAndCollect.uuid,
              name: clickAndCollect.name
            }
          ],
          expectedFields: {
            code: tenEuroFixedPromotionCode.code,
            reductionType: tenEuroFixedPromotionCode.reductionType,
            scope: tenEuroFixedPromotionCode.scope,
            amount: '10',
            startDate: undefined,
            endDate: undefined,
            maximumUsage: undefined,
            minimumAmount: undefined,
            deliveryMethodUuid: undefined
          }
        },
        {
          promotionCode: fifteenPercentPromotionCode,
          availableDeliveryMethods: [deliveryInRelayPoint],
          expectedAvailableDeliveryMethods: [
            {
              uuid: deliveryInRelayPoint.uuid,
              name: deliveryInRelayPoint.name
            }
          ],
          expectedFields: {
            code: fifteenPercentPromotionCode.code,
            reductionType: ReductionType.Percentage,
            scope: fifteenPercentPromotionCode.scope,
            amount: '15',
            startDate: undefined,
            endDate: undefined,
            maximumUsage: undefined,
            minimumAmount: undefined,
            deliveryMethodUuid: undefined
          }
        },
        {
          promotionCode: limitedInTimePromotionCode,
          availableDeliveryMethods: [express],
          expectedAvailableDeliveryMethods: [
            {
              uuid: express.uuid,
              name: express.name
            }
          ],
          expectedFields: {
            code: limitedInTimePromotionCode.code,
            reductionType: ReductionType.Fixed,
            scope: limitedInTimePromotionCode.scope,
            amount: '10',
            startDate: limitedInTimePromotionCode.startDate,
            endDate: limitedInTimePromotionCode.endDate,
            maximumUsage: undefined,
            minimumAmount: undefined,
            deliveryMethodUuid: undefined
          }
        },
        {
          promotionCode: limitedPromotionCode,
          availableDeliveryMethods: [
            clickAndCollect,
            deliveryInRelayPoint,
            express
          ],
          expectedAvailableDeliveryMethods: [
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
          ],
          expectedFields: {
            code: limitedPromotionCode.code,
            reductionType: ReductionType.Fixed,
            scope: limitedPromotionCode.scope,
            amount: '10',
            startDate: limitedPromotionCode.startDate,
            endDate: limitedPromotionCode.endDate,
            maximumUsage: limitedPromotionCode.conditions.maximumUsage,
            minimumAmount: undefined,
            deliveryMethodUuid: undefined
          }
        },
        {
          promotionCode: fifteenPercentIfMiniumAmountPromotionCode,
          availableDeliveryMethods: [],
          expectedAvailableDeliveryMethods: [],
          expectedFields: {
            code: fifteenPercentIfMiniumAmountPromotionCode.code,
            reductionType: ReductionType.Percentage,
            scope: fifteenPercentIfMiniumAmountPromotionCode.scope,
            amount: '15',
            startDate: fifteenPercentIfMiniumAmountPromotionCode.startDate,
            endDate: fifteenPercentIfMiniumAmountPromotionCode.endDate,
            maximumUsage:
              fifteenPercentIfMiniumAmountPromotionCode.conditions.maximumUsage,
            minimumAmount: '20',
            deliveryMethodUuid: undefined
          }
        },
        {
          promotionCode: deliveryPromotionCode,
          availableDeliveryMethods: [deliveryInRelayPoint],
          expectedAvailableDeliveryMethods: [
            {
              uuid: deliveryInRelayPoint.uuid,
              name: deliveryInRelayPoint.name
            }
          ],
          expectedFields: {
            code: deliveryPromotionCode.code,
            reductionType: ReductionType.Percentage,
            scope: deliveryPromotionCode.scope,
            amount: '100',
            startDate: deliveryPromotionCode.startDate,
            endDate: deliveryPromotionCode.endDate,
            maximumUsage: undefined,
            minimumAmount: undefined,
            deliveryMethodUuid:
              deliveryPromotionCode.conditions.deliveryMethodUuid
          }
        }
      ])(
        'For promotion code',
        ({
          promotionCode,
          availableDeliveryMethods,
          expectedAvailableDeliveryMethods,
          expectedFields
        }) => {
          beforeEach(() => {
            givenCurrentPromotionCodeIs(promotionCode)
            givenAvailableDeliveryMethods(availableDeliveryMethods)
            whenGetPromotionCodeFormEditVM()
          })
          describe.each(basicFields)(
            'Basic fields initialization',
            ({ field }) => {
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
                ).toStrictEqual(
                  expectedFields[field as keyof typeof expectedFields]
                )
              })
            }
          )
          describe('Delivery method choices', () => {
            it('should provide all delivery methods', () => {
              expect(vm.getAvailableDeliveryMethods()).toStrictEqual(
                expectedAvailableDeliveryMethods
              )
            })
          })
          describe('Validation', () => {
            describe('Display validate', () => {
              it('should never display the validate button', () => {
                expect(vm.getDisplayValidate()).toBe(true)
              })
            })
            describe('Can validate', () => {
              it('should not allow to validate', () => {
                expect(vm.getCanValidate()).toBe(true)
              })
            })
          })
        }
      )
    })
    describe('Type choices', () => {
      it('should provide available type choices', () => {
        expect(vm.getAvailableTypeChoices()).toStrictEqual(availableTypeChoices)
      })
    })
    describe('Scope choices', () => {
      it('should provide available scope choices', () => {
        expect(vm.getAvailableScopeChoices()).toStrictEqual(
          availableScopeChoices
        )
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
          givenCurrentPromotionCodeIs(tenEuroFixedPromotionCode)
          whenGetPromotionCodeFormEditVM()
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
  })

  describe('Validation', () => {
    beforeEach(() => {
      givenCurrentPromotionCodeIs(tenEuroFixedPromotionCode)
      whenGetPromotionCodeFormEditVM()
    })
    it('should allow to validate if required fields are filled', () => {
      vm.set('code', 'NEW_CODE')
      vm.set('amount', '15')
      expect(vm.getCanValidate()).toBe(true)
    })
    it('should not allow to validate if code is not filled', () => {
      vm.set('code', '')
      expect(vm.getCanValidate()).toBe(false)
    })
    it('should not allow to validate if amount is not filled', () => {
      vm.set('amount', '')
      expect(vm.getCanValidate()).toBe(false)
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

  const givenCurrentPromotionCodeIs = (promotionCode: PromotionCode) => {
    promotionCodeStore.current = promotionCode
  }

  const givenAvailableDeliveryMethods = (
    deliveryMethods: Array<DeliveryMethod>
  ) => {
    deliveryMethodStore.items = deliveryMethods
  }

  const whenGetPromotionCodeFormEditVM = () => {
    vm = promotionCodeFormEditVM(key)
  }
})
