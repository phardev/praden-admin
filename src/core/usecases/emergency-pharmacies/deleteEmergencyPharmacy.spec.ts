import { createPinia, setActivePinia } from 'pinia'
import { deleteEmergencyPharmacy } from '@core/usecases/emergency-pharmacies/deleteEmergencyPharmacy'
import { InMemoryEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/inMemoryEmergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  emergencyPharmacy1,
  emergencyPharmacy2
} from '@utils/testData/emergencyPharmacies'

describe('EmergencyPharmacy deletion', () => {
  let emergencyPharmacyStore: any
  let emergencyPharmacyGateway: InMemoryEmergencyPharmacyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
    emergencyPharmacyGateway = new InMemoryEmergencyPharmacyGateway(
      new FakeUuidGenerator()
    )
  })

  describe('Delete emergency pharmacy', () => {
    it('should remove pharmacy from store', async () => {
      givenExistingPharmacies(emergencyPharmacy1, emergencyPharmacy2)
      await whenDeleteEmergencyPharmacy(emergencyPharmacy1.uuid)
      expectPharmacyNotToBeInStore(emergencyPharmacy1)
    })
  })

  const givenExistingPharmacies = (...pharmacies: any[]) => {
    emergencyPharmacyGateway.feedWith(...pharmacies)
    emergencyPharmacyStore.list(pharmacies)
  }

  const whenDeleteEmergencyPharmacy = async (uuid: string) => {
    await deleteEmergencyPharmacy(uuid, emergencyPharmacyGateway)
  }

  const expectPharmacyNotToBeInStore = (pharmacy: any) => {
    expect(emergencyPharmacyStore.items).not.toContainEqual(pharmacy)
  }
})
