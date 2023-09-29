import { PromotionGateway } from '@core/gateways/promotionGateway'
import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion
} from '@core/entities/promotion'
import { UUID } from '@core/types/types'
import axios from 'axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'

export class RealPromotionGateway
  extends RealGateway
  implements PromotionGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async create(promotion: CreatePromotionDTO): Promise<Promotion> {
    const res = await axios.post(
      `${this.baseUrl}/promotions/`,
      JSON.stringify(promotion)
    )
    return Promise.resolve(res.data)
  }

  async edit(uuid: UUID, promotion: EditPromotionDTO): Promise<Promotion> {
    const res = await axios.put(
      `${this.baseUrl}/promotions/${uuid}/`,
      JSON.stringify(promotion)
    )
    return Promise.resolve(res.data)
  }

  async getByUuid(uuid: UUID): Promise<Promotion> {
    const res = await axios.get(`${this.baseUrl}/promotions/${uuid}/`)
    return Promise.resolve(res.data)
  }

  async list(): Promise<Array<Promotion>> {
    const res = await axios.get(`${this.baseUrl}/promotions/`)
    return Promise.resolve(res.data)
  }
}
