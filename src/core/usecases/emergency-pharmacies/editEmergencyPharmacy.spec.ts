import { createPinia, setActivePinia } from 'pinia'
import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import {
  editEmergencyPharmacy,
  EditEmergencyPharmacyDTO
} from '@core/usecases/emergency-pharmacies/editEmergencyPharmacy'
import { InMemoryEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/inMemoryEmergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { emergencyPharmacy1 } from '@utils/testData/emergencyPharmacies'

describe('EmergencyPharmacy edition', () => {
  let emergencyPharmacyStore: any
  let emergencyPharmacyGateway: InMemoryEmergencyPharmacyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
    emergencyPharmacyGateway = new InMemoryEmergencyPharmacyGateway(
      new FakeUuidGenerator()
    )
  })

  describe('Update pharmacy name', () => {
    it('should update pharmacy in store', async () => {
      givenExistingPharmacy(emergencyPharmacy1)
      const dto: EditEmergencyPharmacyDTO = { name: 'Updated Name' }
      await whenEditEmergencyPharmacy(emergencyPharmacy1.uuid, dto)
      const expected: EmergencyPharmacy = {
        ...emergencyPharmacy1,
        name: 'Updated Name'
      }
      expectPharmacyToBeInStore(expected)
    })
  })

  describe('Update pharmacy isActive status', () => {
    it('should update pharmacy in store', async () => {
      givenExistingPharmacy(emergencyPharmacy1)
      const dto: EditEmergencyPharmacyDTO = { isActive: false }
      await whenEditEmergencyPharmacy(emergencyPharmacy1.uuid, dto)
      const expected: EmergencyPharmacy = {
        ...emergencyPharmacy1,
        isActive: false
      }
      expectPharmacyToBeInStore(expected)
    })
  })

  const givenExistingPharmacy = (pharmacy: EmergencyPharmacy) => {
    emergencyPharmacyGateway.feedWith(pharmacy)
    emergencyPharmacyStore.add(pharmacy)
  }

  const whenEditEmergencyPharmacy = async (
    uuid: string,
    dto: EditEmergencyPharmacyDTO
  ) => {
    await editEmergencyPharmacy(uuid, dto, emergencyPharmacyGateway)
  }

  const expectPharmacyToBeInStore = (pharmacy: EmergencyPharmacy) => {
    expect(emergencyPharmacyStore.items).toContainEqual(pharmacy)
  }
})
