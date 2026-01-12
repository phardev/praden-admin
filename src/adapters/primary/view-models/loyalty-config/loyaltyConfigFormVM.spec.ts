import { loyaltyConfigFormVM } from '@adapters/primary/view-models/loyalty-config/loyaltyConfigFormVM'
import { useLoyaltyConfigStore } from '@store/loyaltyConfigStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Loyalty config form VM', () => {
  let loyaltyConfigStore: ReturnType<typeof useLoyaltyConfigStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyConfigStore = useLoyaltyConfigStore()
  })

  describe('Initialize form', () => {
    it('should initialize form with store values', () => {
      loyaltyConfigStore.setConfig({ pointsPerEuro: 5, isEnabled: true })
      const vm = loyaltyConfigFormVM()
      vm.initForm()
      expect(vm.pointsPerEuro).toBe(5)
    })
  })

  describe('Change detection', () => {
    it('should detect changes when pointsPerEuro is modified', () => {
      loyaltyConfigStore.setConfig({ pointsPerEuro: 1, isEnabled: false })
      const vm = loyaltyConfigFormVM()
      vm.initForm()
      vm.setPointsPerEuro(5)
      expect(vm.hasChanges).toBe(true)
    })
  })

  describe('Get form data', () => {
    it('should return current form values', () => {
      loyaltyConfigStore.setConfig({ pointsPerEuro: 3, isEnabled: true })
      const vm = loyaltyConfigFormVM()
      vm.initForm()
      const data = vm.getFormData()
      expect(data.pointsPerEuro).toBe(3)
    })
  })
})
