import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/inMemoryDeliveryPriceRuleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type {
  DeliveryPriceRule,
  EditDeliveryPriceRuleDTO
} from '@core/entities/deliveryPriceRule'
import type { UUID } from '@core/types/types'
import { editDeliveryPriceRule } from '@core/usecases/delivery-price-rules/edit-delivery-price-rule/editDeliveryPriceRule'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import {
  deliveryPriceRule1,
  deliveryPriceRule2,
  deliveryPriceRule3
} from '@utils/testData/deliveryPriceRules'
import { createPinia, setActivePinia } from 'pinia'

describe('Edit delivery price rule', () => {
  let gateway: InMemoryDeliveryPriceRuleGateway
  let store: ReturnType<typeof useDeliveryPriceRuleStore>
  const dateProvider = new FakeDateProvider()
  const NOW = 1704153600000

  beforeEach(() => {
    setActivePinia(createPinia())
    gateway = new InMemoryDeliveryPriceRuleGateway(
      new FakeUuidGenerator(),
      dateProvider
    )
    store = useDeliveryPriceRuleStore()
    dateProvider.feedWith(NOW)
    gateway.setCurrentUser('editor@example.com')
  })

  describe('The delivery price rule exists', () => {
    let expectedRules: Array<DeliveryPriceRule>

    beforeEach(() => {
      givenExistingDeliveryPriceRules(
        deliveryPriceRule1,
        deliveryPriceRule2,
        deliveryPriceRule3
      )
    })

    describe('Update name field', () => {
      beforeEach(async () => {
        const dto: EditDeliveryPriceRuleDTO = {
          name: 'Nouveau nom'
        }
        expectedRules = [
          {
            ...deliveryPriceRule1,
            name: 'Nouveau nom',
            updatedAt: NOW,
            updatedBy: 'editor@example.com'
          },
          deliveryPriceRule2,
          deliveryPriceRule3
        ]
        await whenEditDeliveryPriceRule(deliveryPriceRule1.uuid, dto)
      })

      it('should update field in store', () => {
        expect(store.items).toStrictEqual(expectedRules)
      })
    })

    describe('Update price field', () => {
      beforeEach(async () => {
        const dto: EditDeliveryPriceRuleDTO = {
          price: 790
        }
        expectedRules = [
          deliveryPriceRule1,
          {
            ...deliveryPriceRule2,
            price: 790,
            updatedAt: NOW,
            updatedBy: 'editor@example.com'
          },
          deliveryPriceRule3
        ]
        await whenEditDeliveryPriceRule(deliveryPriceRule2.uuid, dto)
      })

      it('should update field in store', () => {
        expect(store.items).toStrictEqual(expectedRules)
      })
    })

    describe('Toggle isActive status', () => {
      beforeEach(async () => {
        const dto: EditDeliveryPriceRuleDTO = {
          isActive: false
        }
        expectedRules = [
          {
            ...deliveryPriceRule1,
            isActive: false,
            updatedAt: NOW,
            updatedBy: 'editor@example.com'
          },
          deliveryPriceRule2,
          deliveryPriceRule3
        ]
        await whenEditDeliveryPriceRule(deliveryPriceRule1.uuid, dto)
      })

      it('should update field in store', () => {
        expect(store.items).toStrictEqual(expectedRules)
      })
    })

    describe('Update date range', () => {
      beforeEach(async () => {
        const dto: EditDeliveryPriceRuleDTO = {
          startDate: 1704240000000,
          endDate: 1704326400000
        }
        expectedRules = [
          {
            ...deliveryPriceRule1,
            startDate: 1704240000000,
            endDate: 1704326400000,
            updatedAt: NOW,
            updatedBy: 'editor@example.com'
          },
          deliveryPriceRule2,
          deliveryPriceRule3
        ]
        await whenEditDeliveryPriceRule(deliveryPriceRule1.uuid, dto)
      })

      it('should update field in store', () => {
        expect(store.items).toStrictEqual(expectedRules)
      })
    })

    describe('Update priority', () => {
      beforeEach(async () => {
        const dto: EditDeliveryPriceRuleDTO = {
          priority: 5
        }
        expectedRules = [
          {
            ...deliveryPriceRule1,
            priority: 5,
            updatedAt: NOW,
            updatedBy: 'editor@example.com'
          },
          deliveryPriceRule2,
          deliveryPriceRule3
        ]
        await whenEditDeliveryPriceRule(deliveryPriceRule1.uuid, dto)
      })

      it('should update field in store', () => {
        expect(store.items).toStrictEqual(expectedRules)
      })
    })
  })

  const givenExistingDeliveryPriceRules = (
    ...rules: Array<DeliveryPriceRule>
  ) => {
    gateway.feedWith(...rules)
    store.items = [...rules]
  }

  const whenEditDeliveryPriceRule = async (
    uuid: UUID,
    dto: EditDeliveryPriceRuleDTO
  ) => {
    await editDeliveryPriceRule(uuid, dto, gateway)
  }
})
