import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/inMemoryDeliveryPriceRuleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'
import { DeliveryPriceRuleDoesNotExistsError } from '@core/errors/DeliveryPriceRuleDoesNotExistsError'
import type { UUID } from '@core/types/types'
import { deleteDeliveryPriceRule } from '@core/usecases/delivery-price-rules/delete-delivery-price-rule/deleteDeliveryPriceRule'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import {
  deliveryPriceRule1,
  deliveryPriceRule2,
  deliveryPriceRule3
} from '@utils/testData/deliveryPriceRules'
import { createPinia, setActivePinia } from 'pinia'

describe('Delete delivery price rule', () => {
  let gateway: InMemoryDeliveryPriceRuleGateway
  let store: ReturnType<typeof useDeliveryPriceRuleStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    gateway = new InMemoryDeliveryPriceRuleGateway(
      new FakeUuidGenerator(),
      new FakeDateProvider()
    )
    store = useDeliveryPriceRuleStore()
  })

  describe('The delivery price rule exists', () => {
    beforeEach(() => {
      givenExistingDeliveryPriceRules(
        deliveryPriceRule1,
        deliveryPriceRule2,
        deliveryPriceRule3
      )
    })

    describe('Delete the first rule', () => {
      it('should remove the rule from the store', async () => {
        await whenDeleteDeliveryPriceRule(deliveryPriceRule1.uuid)
        expect(store.items).toStrictEqual([
          deliveryPriceRule2,
          deliveryPriceRule3
        ])
      })
    })

    describe('Delete another rule', () => {
      it('should remove the rule from the store', async () => {
        await whenDeleteDeliveryPriceRule(deliveryPriceRule2.uuid)
        expect(store.items).toStrictEqual([
          deliveryPriceRule1,
          deliveryPriceRule3
        ])
      })
    })
  })

  describe('The delivery price rule does not exist', () => {
    it('should throw an error', async () => {
      await expect(whenDeleteDeliveryPriceRule('not-exists')).rejects.toThrow(
        DeliveryPriceRuleDoesNotExistsError
      )
    })
  })

  const givenExistingDeliveryPriceRules = (
    ...rules: Array<DeliveryPriceRule>
  ) => {
    gateway.feedWith(...rules)
    store.items = JSON.parse(JSON.stringify(rules))
  }

  const whenDeleteDeliveryPriceRule = async (uuid: UUID) => {
    await deleteDeliveryPriceRule(uuid, gateway)
  }
})
