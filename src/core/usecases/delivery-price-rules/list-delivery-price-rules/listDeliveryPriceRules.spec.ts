import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/inMemoryDeliveryPriceRuleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'
import { listDeliveryPriceRules } from '@core/usecases/delivery-price-rules/list-delivery-price-rules/listDeliveryPriceRules'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import {
  christmasFreeShipping,
  freeShippingOver39,
  standardShipping
} from '@utils/testData/deliveryPriceRules'
import { createPinia, setActivePinia } from 'pinia'

describe('List delivery price rules', () => {
  let deliveryPriceRuleStore: ReturnType<typeof useDeliveryPriceRuleStore>
  let deliveryPriceRuleGateway: InMemoryDeliveryPriceRuleGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    deliveryPriceRuleStore = useDeliveryPriceRuleStore()
    deliveryPriceRuleGateway = new InMemoryDeliveryPriceRuleGateway(
      new FakeUuidGenerator(),
      new FakeDateProvider()
    )
  })

  describe('There are no delivery price rules', () => {
    it('should list nothing', async () => {
      await whenListDeliveryPriceRules()
      expectStoreToContain()
    })
  })

  describe('There are some delivery price rules', () => {
    it('should list all of them sorted by priority', async () => {
      givenExistingDeliveryPriceRules(
        standardShipping,
        freeShippingOver39,
        christmasFreeShipping
      )
      await whenListDeliveryPriceRules()
      expectStoreToContain(
        christmasFreeShipping,
        freeShippingOver39,
        standardShipping
      )
    })
  })

  const givenExistingDeliveryPriceRules = (
    ...rules: Array<DeliveryPriceRule>
  ) => {
    deliveryPriceRuleGateway.feedWith(...rules)
  }

  const whenListDeliveryPriceRules = async () => {
    await listDeliveryPriceRules(deliveryPriceRuleGateway)
  }

  const expectStoreToContain = (...rules: Array<DeliveryPriceRule>) => {
    expect(deliveryPriceRuleStore.items).toStrictEqual(rules)
  }
})
