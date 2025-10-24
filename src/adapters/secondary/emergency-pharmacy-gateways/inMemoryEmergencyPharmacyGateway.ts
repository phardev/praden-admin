import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateEmergencyPharmacyDTO } from '@core/usecases/emergency-pharmacies/createEmergencyPharmacy'
import { EditEmergencyPharmacyDTO } from '@core/usecases/emergency-pharmacies/editEmergencyPharmacy'

export class InMemoryEmergencyPharmacyGateway
  implements EmergencyPharmacyGateway
{
  private pharmacies: Array<EmergencyPharmacy> = []
  private uuidGenerator: UuidGenerator
  private error: Error | null = null

  constructor(uuidGenerator?: UuidGenerator) {
    this.uuidGenerator = uuidGenerator || { generate: () => 'generated-uuid' }
  }

  async list(): Promise<Array<EmergencyPharmacy>> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.pharmacies)))
  }

  async create(dto: CreateEmergencyPharmacyDTO): Promise<EmergencyPharmacy> {
    const pharmacy: EmergencyPharmacy = {
      uuid: this.uuidGenerator.generate(),
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      date: dto.date,
      isActive: dto.isActive
    }
    this.pharmacies.push(pharmacy)
    return Promise.resolve(JSON.parse(JSON.stringify(pharmacy)))
  }

  async edit(
    uuid: UUID,
    dto: EditEmergencyPharmacyDTO
  ): Promise<EmergencyPharmacy> {
    const index = this.pharmacies.findIndex((p) => p.uuid === uuid)
    if (index === -1) {
      throw new Error('EmergencyPharmacy not found')
    }
    this.pharmacies[index] = Object.assign(this.pharmacies[index], dto)
    return Promise.resolve(JSON.parse(JSON.stringify(this.pharmacies[index])))
  }

  async delete(uuid: UUID): Promise<void> {
    const index = this.pharmacies.findIndex((p) => p.uuid === uuid)
    if (index === -1) {
      throw new Error('EmergencyPharmacy not found')
    }
    this.pharmacies.splice(index, 1)
    return Promise.resolve()
  }

  async get(uuid: UUID): Promise<EmergencyPharmacy> {
    const pharmacy = this.pharmacies.find((p) => p.uuid === uuid)
    if (!pharmacy) {
      throw new Error('EmergencyPharmacy not found')
    }
    return Promise.resolve(JSON.parse(JSON.stringify(pharmacy)))
  }

  feedWith(...pharmacies: Array<EmergencyPharmacy>) {
    this.pharmacies = JSON.parse(JSON.stringify(pharmacies))
    this.error = null
  }

  feedWithError(error: Error) {
    this.error = error
  }
}
