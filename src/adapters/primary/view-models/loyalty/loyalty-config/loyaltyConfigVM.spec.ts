import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { loyaltyConfigVM } from './loyaltyConfigVM'

describe('Loyalty Config VM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial state', () => {
    it('should return eurosPerPoint value from store', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()

      expect(vm.eurosPerPoint).toStrictEqual(10)
    })

    it('should return 0 when no config exists', () => {
      const vm = loyaltyConfigVM()

      expect(vm.eurosPerPoint).toStrictEqual(0)
    })
  })

  describe('Editing', () => {
    it('should update eurosPerPoint when set is called', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()
      vm.setEurosPerPoint(15)

      expect(vm.eurosPerPoint).toStrictEqual(15)
    })

    it('should track hasChanges when value is modified', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()
      vm.setEurosPerPoint(15)

      expect(vm.hasChanges).toStrictEqual(true)
    })

    it('should return false for hasChanges when value unchanged', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()

      expect(vm.hasChanges).toStrictEqual(false)
    })

    it('should return false for hasChanges after setting same value', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()
      vm.setEurosPerPoint(10)

      expect(vm.hasChanges).toStrictEqual(false)
    })
  })

  describe('getConfigForSave', () => {
    it('should return current eurosPerPoint value for saving', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()
      vm.setEurosPerPoint(20)

      expect(vm.getConfigForSave()).toStrictEqual(20)
    })
  })

  describe('reset', () => {
    it('should reset to original store value', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()
      vm.setEurosPerPoint(25)
      vm.reset()

      expect(vm.eurosPerPoint).toStrictEqual(10)
    })

    it('should clear hasChanges after reset', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setConfig({
        eurosPerPoint: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })

      const vm = loyaltyConfigVM()
      vm.setEurosPerPoint(25)
      vm.reset()

      expect(vm.hasChanges).toStrictEqual(false)
    })
  })
})
