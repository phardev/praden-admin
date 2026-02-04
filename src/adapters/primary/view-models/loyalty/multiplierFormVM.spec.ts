import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  multiplierFormCreateVM,
  multiplierFormEditVM
} from './multiplierFormVM'

describe('multiplierFormCreateVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty name', () => {
    const vm = multiplierFormCreateVM('test-form')

    expect(vm.get('name').value).toStrictEqual('')
  })

  it('should initialize with default multiplier value of 2', () => {
    const vm = multiplierFormCreateVM('test-form')

    expect(vm.get('multiplierValue').value).toStrictEqual(2)
  })

  it('should initialize with null start date', () => {
    const vm = multiplierFormCreateVM('test-form')

    expect(vm.get('startDate').value).toStrictEqual(null)
  })

  it('should initialize with null end date', () => {
    const vm = multiplierFormCreateVM('test-form')

    expect(vm.get('endDate').value).toStrictEqual(null)
  })

  it('should update name field', async () => {
    const vm = multiplierFormCreateVM('test-form')

    await vm.set('name', 'Double points été')

    expect(vm.get('name').value).toStrictEqual('Double points été')
  })

  it('should update multiplier value', async () => {
    const vm = multiplierFormCreateVM('test-form')

    await vm.set('multiplierValue', 3)

    expect(vm.get('multiplierValue').value).toStrictEqual(3)
  })

  it('should update start date', async () => {
    const vm = multiplierFormCreateVM('test-form')

    await vm.set('startDate', 1717200000000)

    expect(vm.get('startDate').value).toStrictEqual(1717200000000)
  })

  it('should update end date', async () => {
    const vm = multiplierFormCreateVM('test-form')

    await vm.set('endDate', 1725148800000)

    expect(vm.get('endDate').value).toStrictEqual(1725148800000)
  })

  it('should return complete DTO for creation', async () => {
    const vm = multiplierFormCreateVM('test-form')
    await vm.set('name', 'Triple points Noël')
    await vm.set('multiplierValue', 3)
    await vm.set('startDate', 1703116800000)
    await vm.set('endDate', 1703980800000)

    const result = vm.getDto()

    expect(result).toStrictEqual({
      name: 'Triple points Noël',
      multiplierValue: 3,
      startDate: 1703116800000,
      endDate: 1703980800000
    })
  })

  it('should indicate form is invalid when name is empty', () => {
    const vm = multiplierFormCreateVM('test-form')

    expect(vm.isValid()).toStrictEqual(false)
  })

  it('should indicate form is invalid when start date is null', async () => {
    const vm = multiplierFormCreateVM('test-form')
    await vm.set('name', 'Test')

    expect(vm.isValid()).toStrictEqual(false)
  })

  it('should indicate form is invalid when end date is null', async () => {
    const vm = multiplierFormCreateVM('test-form')
    await vm.set('name', 'Test')
    await vm.set('startDate', 1703116800000)

    expect(vm.isValid()).toStrictEqual(false)
  })

  it('should indicate form is valid when all fields filled', async () => {
    const vm = multiplierFormCreateVM('test-form')
    await vm.set('name', 'Test')
    await vm.set('startDate', 1703116800000)
    await vm.set('endDate', 1703980800000)

    expect(vm.isValid()).toStrictEqual(true)
  })

  it('should return canEdit as true for all fields', () => {
    const vm = multiplierFormCreateVM('test-form')

    expect(vm.get('name').canEdit).toStrictEqual(true)
  })
})

describe('multiplierFormEditVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with multiplier name from store', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Existing multiplier',
        multiplierValue: 2.5,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const vm = multiplierFormEditVM('test-form', 'mult-1')

    expect(vm.get('name').value).toStrictEqual('Existing multiplier')
  })

  it('should initialize with multiplier value from store', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Existing multiplier',
        multiplierValue: 2.5,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const vm = multiplierFormEditVM('test-form', 'mult-1')

    expect(vm.get('multiplierValue').value).toStrictEqual(2.5)
  })

  it('should throw error when multiplier not found', () => {
    expect(() => multiplierFormEditVM('test-form', 'unknown')).toThrow(
      'Multiplier not found in store'
    )
  })
})
