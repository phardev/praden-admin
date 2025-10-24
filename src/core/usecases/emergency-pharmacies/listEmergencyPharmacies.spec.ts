import { InMemoryEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/inMemoryEmergencyPharmacyGateway'
import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { listEmergencyPharmacies } from '@core/usecases/emergency-pharmacies/listEmergencyPharmacies'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import {
  emergencyPharmacy1,
  emergencyPharmacy2,
  emergencyPharmacy3
} from '@utils/testData/emergencyPharmacies'
import { createPinia, setActivePinia } from 'pinia'

describe('EmergencyPharmacies list', () => {
  let emergencyPharmacyStore: ReturnType<typeof useEmergencyPharmacyStore>
  let emergencyPharmacyGateway: InMemoryEmergencyPharmacyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
    emergencyPharmacyGateway = new InMemoryEmergencyPharmacyGateway()
  })

  describe('List emergency pharmacies', () => {
    it('should save pharmacies in the store', async () => {
      const pharmacies = [emergencyPharmacy1, emergencyPharmacy2]
      givenExistingPharmacies(...pharmacies)
      await whenListEmergencyPharmacies()
      expectPharmaciesListToBe(pharmacies)
    })

    it('should set loading to true at start of listing pharmacies', () => {
      const pharmacies = [emergencyPharmacy1, emergencyPharmacy2]
      givenExistingPharmacies(...pharmacies)
      const promise = whenListEmergencyPharmacies()
      expectLoadingToBe(true)
      return promise
    })

    it('should set loading to false after listing pharmacies', async () => {
      const pharmacies = [emergencyPharmacy1, emergencyPharmacy2]
      givenExistingPharmacies(...pharmacies)
      await whenListEmergencyPharmacies()
      expectLoadingToBe(false)
    })
  })

  describe('List other emergency pharmacies', () => {
    it('should save pharmacies in the store', async () => {
      const pharmacies = [
        emergencyPharmacy1,
        emergencyPharmacy2,
        emergencyPharmacy3
      ]
      givenExistingPharmacies(...pharmacies)
      await whenListEmergencyPharmacies()
      expectPharmaciesListToBe(pharmacies)
    })
  })

  describe('Error handling', () => {
    it('should set error when gateway fails', async () => {
      givenGatewayWillFail()
      await whenListEmergencyPharmacies()
      expectErrorToBe('Failed to fetch emergency pharmacies')
    })

    it('should set loading to false when gateway fails', async () => {
      givenGatewayWillFail()
      await whenListEmergencyPharmacies()
      expectLoadingToBe(false)
    })
  })

  const givenExistingPharmacies = (...pharmacies: Array<EmergencyPharmacy>) => {
    emergencyPharmacyGateway.feedWith(...pharmacies)
  }

  const givenGatewayWillFail = () => {
    emergencyPharmacyGateway.feedWithError(
      new Error('Failed to fetch emergency pharmacies')
    )
  }

  const whenListEmergencyPharmacies = async () => {
    await listEmergencyPharmacies(emergencyPharmacyGateway)
  }

  const expectPharmaciesListToBe = (pharmacies: Array<EmergencyPharmacy>) => {
    expect(emergencyPharmacyStore.items).toStrictEqual(pharmacies)
  }

  const expectLoadingToBe = (loading: boolean) => {
    expect(emergencyPharmacyStore.isLoading).toBe(loading)
  }

  const expectErrorToBe = (error: string) => {
    expect(emergencyPharmacyStore.error).toBe(error)
  }
})
