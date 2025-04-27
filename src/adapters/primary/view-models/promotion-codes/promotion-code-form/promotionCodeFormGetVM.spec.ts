import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@store/formStore'
import {
  Field,
  TypeChoiceVM
} from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { ReductionType } from '@core/entities/promotion'
import { usePromotionCodeStore } from '@store/promotionCodeStore'
import {
  deliveryPromotionCode,
  fifteenPercentIfMiniumAmountPromotionCode,
  fifteenPercentPromotionCode,
  limitedInTimePromotionCode,
  limitedPromotionCode,
  tenEuroFixedPromotionCode
} from '@utils/testData/promotionCodes'
import { PromotionCode, PromotionScope } from '@core/entities/promotionCode'
import {
  PromotionCodeFormGetVM,
  promotionCodeFormGetVM,
  PromotionScopeChoiceVM
} from '@adapters/primary/view-models/promotion-codes/promotion-code-form/promotionCodeFormGetVM'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  express
} from '@utils/testData/deliveryMethods'
import { DeliveryMethod } from '@core/entities/order'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'

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

describe('Promotion code form get VM', () => {
  let promotionCodeStore: any
  let deliveryMethodStore: any
  let formStore: any
  let vm: PromotionCodeFormGetVM
  const key = 'get-promotion-code-form'

  beforeEach(() => {
    setActivePinia(createPinia())
    promotionCodeStore = usePromotionCodeStore()
    deliveryMethodStore = useDeliveryMethodStore()
    formStore = useFormStore()
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
            whenGetPromotionCodeFormGetVM()
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
                expect(vm.getDisplayValidate()).toBe(false)
              })
            })
            describe('Can validate', () => {
              it('should not allow to validate', () => {
                expect(vm.getCanValidate()).toBe(false)
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
  })

  const givenCurrentPromotionCodeIs = (promotionCode: PromotionCode) => {
    promotionCodeStore.current = promotionCode
  }

  const givenAvailableDeliveryMethods = (
    deliveryMethods: Array<DeliveryMethod>
  ) => {
    deliveryMethodStore.items = deliveryMethods
  }

  const whenGetPromotionCodeFormGetVM = () => {
    vm = promotionCodeFormGetVM(key)
  }
})
