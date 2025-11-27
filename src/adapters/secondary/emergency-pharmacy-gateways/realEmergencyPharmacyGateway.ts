import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { EmergencyPharmacyGateway } from '@core/gateways/emergencyPharmacyGateway'
import { UUID } from '@core/types/types'
import { CreateEmergencyPharmacyDTO } from '@core/usecases/emergency-pharmacies/createEmergencyPharmacy'
import { EditEmergencyPharmacyDTO } from '@core/usecases/emergency-pharmacies/editEmergencyPharmacy'

export class RealEmergencyPharmacyGateway
  extends RealGateway
  implements EmergencyPharmacyGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<EmergencyPharmacy>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/emergency-pharmacies`
    )
    return res.data.items.map(this.convertToEmergencyPharmacy)
  }

  async create(dto: CreateEmergencyPharmacyDTO): Promise<EmergencyPharmacy> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/emergency-pharmacies`,
      dto
    )
    return this.convertToEmergencyPharmacy(res.data.item)
  }

  async edit(
    uuid: UUID,
    dto: EditEmergencyPharmacyDTO
  ): Promise<EmergencyPharmacy> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/emergency-pharmacies/${uuid}`,
      dto
    )
    return this.convertToEmergencyPharmacy(res.data.item)
  }

  async delete(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/emergency-pharmacies/${uuid}`)
  }

  async get(uuid: UUID): Promise<EmergencyPharmacy> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/emergency-pharmacies/${uuid}`
    )
    return this.convertToEmergencyPharmacy(res.data.item)
  }

  private convertToEmergencyPharmacy(data: any): EmergencyPharmacy {
    return {
      uuid: data.uuid,
      name: data.name,
      address: data.address,
      phone: data.phone,
      date: data.date,
      isActive: data.isActive
    }
  }
}
