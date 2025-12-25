import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/inMemoryDeliveryPriceRuleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'
import { DeliveryPriceRuleDoesNotExistsError } from '@core/errors/DeliveryPriceRuleDoesNotExistsError'
import type { UUID } from '@core/types/types'
import { getDeliveryPriceRule } from '@core/usecases/delivery-price-rules/get-delivery-price-rule/getDeliveryPriceRule'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import {
  deliveryPriceRule1,
  deliveryPriceRule2,
  deliveryPriceRule3
} from '@utils/testData/deliveryPriceRules'
import { createPinia, setActivePinia } from 'pinia'

describe('Get delivery price rule', () => {
  let store: ReturnType<typeof useDeliveryPriceRuleStore>
  let gateway: InMemoryDeliveryPriceRuleGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useDeliveryPriceRuleStore()
    gateway = new InMemoryDeliveryPriceRuleGateway(
      new FakeUuidGenerator(),
      new FakeDateProvider()
    )
  })

  describe('Get a delivery price rule', () => {
    it('should save the rule in the store as current', async () => {
      givenExistingDeliveryPriceRules(
        deliveryPriceRule1,
        deliveryPriceRule2,
        deliveryPriceRule3
      )
      await whenGetDeliveryPriceRule(deliveryPriceRule2.uuid)
      expectCurrentRuleToBe(deliveryPriceRule2)
    })
  })

  describe('Get another delivery price rule', () => {
    it('should save the rule in the store as current', async () => {
      givenExistingDeliveryPriceRules(deliveryPriceRule1, deliveryPriceRule3)
      await whenGetDeliveryPriceRule(deliveryPriceRule3.uuid)
      expectCurrentRuleToBe(deliveryPriceRule3)
    })
  })

  describe('The delivery price rule does not exist', () => {
    it('should throw an error', async () => {
      await expect(whenGetDeliveryPriceRule('not-exists')).rejects.toThrow(
        DeliveryPriceRuleDoesNotExistsError
      )
    })
  })

  const givenExistingDeliveryPriceRules = (
    ...rules: Array<DeliveryPriceRule>
  ) => {
    gateway.feedWith(...rules)
  }

  const whenGetDeliveryPriceRule = async (uuid: UUID) => {
    await getDeliveryPriceRule(uuid, gateway)
  }

  const expectCurrentRuleToBe = (rule: DeliveryPriceRule) => {
    expect(store.current).toStrictEqual(rule)
  }
})
