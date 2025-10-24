import { InMemoryEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/inMemoryEmergencyPharmacyGateway'
import { RealEmergencyPharmacyGateway } from '@adapters/secondary/emergency-pharmacy-gateways/realEmergencyPharmacyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as emergencyPharmacies from '@utils/testData/emergencyPharmacies'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const emergencyPharmacyGateway = new InMemoryEmergencyPharmacyGateway(
  uuidGenerator
)
emergencyPharmacyGateway.feedWith(
  emergencyPharmacies.emergencyPharmacy1,
  emergencyPharmacies.emergencyPharmacy2,
  emergencyPharmacies.emergencyPharmacy3
)

export const useEmergencyPharmacyGateway = () => {
  if (isLocalEnv()) {
    return emergencyPharmacyGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealEmergencyPharmacyGateway(BACKEND_URL)
}
