import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { WelcomeCode, WelcomeCodeDTO } from '@core/entities/welcomeCode'
import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealWelcomeCodeGateway
  extends RealGateway
  implements WelcomeCodeGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<WelcomeCode>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/welcome-codes`)
    return res.data
  }

  async create(dto: WelcomeCodeDTO): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/welcome-codes`, dto)
  }

  async edit(uuid: UUID, dto: WelcomeCodeDTO): Promise<void> {
    await axiosWithBearer.put(`${this.baseUrl}/welcome-codes/${uuid}`, dto)
  }

  async enable(uuid: UUID): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/welcome-codes/${uuid}/enable`)
  }

  async disable(uuid: UUID): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/welcome-codes/${uuid}/disable`)
  }
}
