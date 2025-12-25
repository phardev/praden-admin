import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryDeliveryPriceRuleGateway } from '@adapters/secondary/delivery-price-rule-gateways/inMemoryDeliveryPriceRuleGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type {
  CreateDeliveryPriceRuleDTO,
  DeliveryPriceRule
} from '@core/entities/deliveryPriceRule'
import { createDeliveryPriceRule } from '@core/usecases/delivery-price-rules/create-delivery-price-rule/createDeliveryPriceRule'
import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Create delivery price rule', () => {
  let gateway: InMemoryDeliveryPriceRuleGateway
  let store: ReturnType<typeof useDeliveryPriceRuleStore>
  const uuidGenerator = new FakeUuidGenerator()
  const dateProvider = new FakeDateProvider()
  const NOW = 1704067200000

  beforeEach(() => {
    setActivePinia(createPinia())
    gateway = new InMemoryDeliveryPriceRuleGateway(uuidGenerator, dateProvider)
    store = useDeliveryPriceRuleStore()
    dateProvider.feedWith(NOW)
    gateway.setCurrentUser('test-user@example.com')
  })

  describe('Create a rule with all required fields', () => {
    const uuid = 'new-rule-uuid'
    const dto: CreateDeliveryPriceRuleDTO = {
      deliveryMethodUuid: 'delivery-colissimo',
      name: 'Livraison standard',
      price: 590,
      minOrderValue: 0,
      maxWeight: 30000,
      priority: 10,
      startDate: null,
      endDate: null,
      isActive: true
    }
    const expectedRule: DeliveryPriceRule = {
      uuid,
      deliveryMethodUuid: 'delivery-colissimo',
      name: 'Livraison standard',
      price: 590,
      minOrderValue: 0,
      maxWeight: 30000,
      priority: 10,
      startDate: null,
      endDate: null,
      isActive: true,
      createdAt: NOW,
      createdBy: 'test-user@example.com',
      updatedAt: NOW,
      updatedBy: 'test-user@example.com'
    }

    beforeEach(async () => {
      uuidGenerator.setNext(uuid)
      await whenCreateDeliveryPriceRule(dto)
    })

    it('should add the rule in the gateway', async () => {
      expect(await gateway.list()).toStrictEqual([expectedRule])
    })

    it('should add the rule in the store', () => {
      expect(store.items).toStrictEqual([expectedRule])
    })
  })

  describe('Create a rule with date range', () => {
    const uuid = 'rule-with-dates'
    const dto: CreateDeliveryPriceRuleDTO = {
      deliveryMethodUuid: 'delivery-colissimo',
      name: 'Livraison gratuite Noël',
      price: 0,
      minOrderValue: 0,
      maxWeight: 30000,
      priority: 0,
      startDate: 1703116800000,
      endDate: 1703980800000,
      isActive: true
    }
    const expectedRule: DeliveryPriceRule = {
      uuid,
      deliveryMethodUuid: 'delivery-colissimo',
      name: 'Livraison gratuite Noël',
      price: 0,
      minOrderValue: 0,
      maxWeight: 30000,
      priority: 0,
      startDate: 1703116800000,
      endDate: 1703980800000,
      isActive: true,
      createdAt: NOW,
      createdBy: 'test-user@example.com',
      updatedAt: NOW,
      updatedBy: 'test-user@example.com'
    }

    beforeEach(async () => {
      uuidGenerator.setNext(uuid)
      await whenCreateDeliveryPriceRule(dto)
    })

    it('should add the rule with dates in the store', () => {
      expect(store.items).toStrictEqual([expectedRule])
    })
  })

  describe('Create an inactive rule', () => {
    const uuid = 'inactive-rule'
    const dto: CreateDeliveryPriceRuleDTO = {
      deliveryMethodUuid: 'delivery-mondial-relay',
      name: 'Ancienne règle',
      price: 299,
      minOrderValue: 0,
      maxWeight: 10000,
      priority: 5,
      startDate: null,
      endDate: null,
      isActive: false
    }
    const expectedRule: DeliveryPriceRule = {
      uuid,
      deliveryMethodUuid: 'delivery-mondial-relay',
      name: 'Ancienne règle',
      price: 299,
      minOrderValue: 0,
      maxWeight: 10000,
      priority: 5,
      startDate: null,
      endDate: null,
      isActive: false,
      createdAt: NOW,
      createdBy: 'test-user@example.com',
      updatedAt: NOW,
      updatedBy: 'test-user@example.com'
    }

    beforeEach(async () => {
      uuidGenerator.setNext(uuid)
      await whenCreateDeliveryPriceRule(dto)
    })

    it('should add the inactive rule in the store', () => {
      expect(store.items).toStrictEqual([expectedRule])
    })
  })

  const whenCreateDeliveryPriceRule = async (
    dto: CreateDeliveryPriceRuleDTO
  ) => {
    await createDeliveryPriceRule(dto, gateway)
  }
})
