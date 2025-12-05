import { useDeliveryPriceRuleStore } from '@store/deliveryPriceRuleStore'
import {
  christmasFreeShipping,
  standardShipping
} from '@utils/testData/deliveryPriceRules'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { deliveryPriceRuleFormEditVM } from './deliveryPriceRuleFormEditVM'

describe('deliveryPriceRuleFormEditVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with existing rule values', () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    expect(vm.get('name').value).toStrictEqual('Livraison standard')
  })

  it('should initialize price from existing rule', () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    expect(vm.get('price').value).toStrictEqual(590)
  })

  it('should initialize dates from existing rule', () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(christmasFreeShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    expect(vm.get('startDate').value).toStrictEqual(1703116800000)
    expect(vm.get('endDate').value).toStrictEqual(1703980800000)
  })

  it('should return DTO with only changed fields', async () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    await vm.set('name', 'Nouveau nom')

    expect(vm.getChangedDto()).toStrictEqual({
      name: 'Nouveau nom'
    })
  })

  it('should return empty DTO when no changes', () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    expect(vm.getChangedDto()).toStrictEqual({})
  })

  it('should track hasChanges correctly when field changed', async () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    await vm.set('priority', 5)

    expect(vm.hasChanges()).toStrictEqual(true)
  })

  it('should track hasChanges correctly when no changes', () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    expect(vm.hasChanges()).toStrictEqual(false)
  })

  it('should return full DTO for update', () => {
    const store = useDeliveryPriceRuleStore()
    store.setCurrent(standardShipping)
    const vm = deliveryPriceRuleFormEditVM('test-form')

    expect(vm.getDto()).toStrictEqual({
      deliveryMethodUuid: 'delivery-colissimo',
      name: 'Livraison standard',
      price: 590,
      minOrderValue: 0,
      maxWeight: 30000,
      priority: 10,
      startDate: null,
      endDate: null,
      isActive: true
    })
  })
})
