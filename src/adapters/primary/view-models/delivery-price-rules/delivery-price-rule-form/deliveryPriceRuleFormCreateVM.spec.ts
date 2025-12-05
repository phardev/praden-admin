import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { deliveryPriceRuleFormCreateVM } from './deliveryPriceRuleFormCreateVM'

describe('deliveryPriceRuleFormCreateVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    const result = vm.getDto()

    expect(result).toStrictEqual({
      deliveryMethodUuid: '',
      name: '',
      price: 0,
      minOrderValue: 0,
      maxWeight: 5000,
      priority: 0,
      startDate: null,
      endDate: null,
      isActive: true
    })
  })

  it('should update name field', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('name', 'Livraison gratuite')

    expect(vm.get('name').value).toStrictEqual('Livraison gratuite')
  })

  it('should update delivery method uuid', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('deliveryMethodUuid', 'delivery-colissimo')

    expect(vm.get('deliveryMethodUuid').value).toStrictEqual(
      'delivery-colissimo'
    )
  })

  it('should update price in cents from euros', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('priceInEuros', 5.9)

    expect(vm.get('price').value).toStrictEqual(590)
  })

  it('should update min order value in cents from euros', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('minOrderValueInEuros', 39)

    expect(vm.get('minOrderValue').value).toStrictEqual(3900)
  })

  it('should update max weight in grams from kg', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('maxWeightInKg', 10)

    expect(vm.get('maxWeight').value).toStrictEqual(10000)
  })

  it('should update priority', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('priority', 5)

    expect(vm.get('priority').value).toStrictEqual(5)
  })

  it('should update isActive', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('isActive', false)

    expect(vm.get('isActive').value).toStrictEqual(false)
  })

  it('should update start and end dates', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')

    await vm.set('startDate', 1703116800000)
    await vm.set('endDate', 1703980800000)

    expect(vm.getDto().startDate).toStrictEqual(1703116800000)
    expect(vm.getDto().endDate).toStrictEqual(1703980800000)
  })

  it('should return complete DTO for creation', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')
    await vm.set('deliveryMethodUuid', 'delivery-colissimo')
    await vm.set('name', 'Livraison gratuite dès 39€')
    await vm.set('priceInEuros', 0)
    await vm.set('minOrderValueInEuros', 39)
    await vm.set('maxWeightInKg', 30)
    await vm.set('priority', 1)
    await vm.set('isActive', true)

    const result = vm.getDto()

    expect(result).toStrictEqual({
      deliveryMethodUuid: 'delivery-colissimo',
      name: 'Livraison gratuite dès 39€',
      price: 0,
      minOrderValue: 3900,
      maxWeight: 30000,
      priority: 1,
      startDate: null,
      endDate: null,
      isActive: true
    })
  })

  it('should indicate form is valid when required fields filled', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')
    await vm.set('deliveryMethodUuid', 'delivery-colissimo')
    await vm.set('name', 'Livraison standard')

    expect(vm.isValid()).toStrictEqual(true)
  })

  it('should indicate form is invalid when name is empty', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')
    await vm.set('deliveryMethodUuid', 'delivery-colissimo')
    await vm.set('name', '')

    expect(vm.isValid()).toStrictEqual(false)
  })

  it('should indicate form is invalid when delivery method is empty', async () => {
    const vm = deliveryPriceRuleFormCreateVM('test-form')
    await vm.set('name', 'Livraison standard')
    await vm.set('deliveryMethodUuid', '')

    expect(vm.isValid()).toStrictEqual(false)
  })
})
