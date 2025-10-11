import { createPinia, setActivePinia } from 'pinia'
import { getEmergencyPharmacy } from '@core/usecases/emergency-pharmacies/getEmergencyPharmacy'
import { InMemoryEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/inMemoryEmergencyPharmacyGateway'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import {
  emergencyPharmacy1,
  emergencyPharmacy2
} from '@utils/testData/emergencyPharmacies'

describe('EmergencyPharmacy get', () => {
  let emergencyPharmacyStore: any
  let emergencyPharmacyGateway: InMemoryEmergencyPharmacyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
    emergencyPharmacyGateway = new InMemoryEmergencyPharmacyGateway(
      new FakeUuidGenerator()
    )
  })

  describe('Get a pharmacy', () => {
    it('should save the pharmacy in the store', async () => {
      givenExistingPharmacies(emergencyPharmacy1, emergencyPharmacy2)
      await whenGetEmergencyPharmacy(emergencyPharmacy1.uuid)
      expectCurrentPharmacyToBe(emergencyPharmacy1)
    })
  })

  describe('Get another pharmacy', () => {
    it('should save the pharmacy in the store', async () => {
      givenExistingPharmacies(emergencyPharmacy1, emergencyPharmacy2)
      await whenGetEmergencyPharmacy(emergencyPharmacy2.uuid)
      expectCurrentPharmacyToBe(emergencyPharmacy2)
    })
  })

  const givenExistingPharmacies = (...pharmacies: any[]) => {
    emergencyPharmacyGateway.feedWith(...pharmacies)
  }

  const whenGetEmergencyPharmacy = async (uuid: string) => {
    await getEmergencyPharmacy(uuid, emergencyPharmacyGateway)
  }

  const expectCurrentPharmacyToBe = (pharmacy: any) => {
    expect(emergencyPharmacyStore.current).toStrictEqual(pharmacy)
  }
})
