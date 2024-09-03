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

  async getPromotionsForProduct(productUuid: UUID): Promise<Array<Promotion>> {
    const res = await axios.get(
      `${this.baseUrl}/products/${productUuid}/promotions`
    )
    return Promise.resolve(res.data.items)
  }

  async create(promotion: CreatePromotionDTO): Promise<Promotion> {
    const formData = this.createFormData(promotion)
    const res = await axios.post(`${this.baseUrl}/promotions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return Promise.resolve(res.data.item)
  }

  async edit(uuid: UUID, promotion: EditPromotionDTO): Promise<Promotion> {
    const formData = this.createFormData(promotion)
    formData.append('uuid', uuid)
    const res = await axios.patch(`${this.baseUrl}/promotions/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return Promise.resolve(res.data.item)
  }

  async getByUuid(uuid: UUID): Promise<Promotion> {
    const res = await axios.get(`${this.baseUrl}/promotions/${uuid}/`)
    console.log('res: ', res)
    return Promise.resolve(res.data.item)
  }

  async list(): Promise<Array<Promotion>> {
    const res = await axios.get(`${this.baseUrl}/promotions/`)
    return Promise.resolve(res.data.items)
  }
}
