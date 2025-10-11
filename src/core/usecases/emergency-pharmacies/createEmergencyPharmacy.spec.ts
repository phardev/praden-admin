import { createPinia, setActivePinia } from 'pinia'
import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import {
  createEmergencyPharmacy,
  CreateEmergencyPharmacyDTO
} from '@core/usecases/emergency-pharmacies/createEmergencyPharmacy'
import { InMemoryEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/inMemoryEmergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

describe('EmergencyPharmacy creation', () => {
  let emergencyPharmacyStore: any
  let emergencyPharmacyGateway: InMemoryEmergencyPharmacyGateway
  let uuidGenerator: FakeUuidGenerator

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
    uuidGenerator = new FakeUuidGenerator()
    emergencyPharmacyGateway = new InMemoryEmergencyPharmacyGateway(
      uuidGenerator
    )
  })

  describe('Create emergency pharmacy', () => {
    it('should add pharmacy to store', async () => {
      uuidGenerator.setNext('uuid-0')
      const dto: CreateEmergencyPharmacyDTO = {
        name: 'Pharmacie Test',
        address: '123 Rue de Test',
        phone: '01 23 45 67 89',
        date: 1700000000000,
        isActive: true
      }
      await whenCreateEmergencyPharmacy(dto)
      const expected: EmergencyPharmacy = {
        uuid: 'uuid-0',
        name: 'Pharmacie Test',
        address: '123 Rue de Test',
        phone: '01 23 45 67 89',
        date: 1700000000000,
        isActive: true
      }
      expectPharmacyToBeInStore(expected)
    })
  })

  const whenCreateEmergencyPharmacy = async (
    dto: CreateEmergencyPharmacyDTO
  ) => {
    await createEmergencyPharmacy(dto, emergencyPharmacyGateway)
  }

  const expectPharmacyToBeInStore = (pharmacy: EmergencyPharmacy) => {
    expect(emergencyPharmacyStore.items).toContainEqual(pharmacy)
  }
})
