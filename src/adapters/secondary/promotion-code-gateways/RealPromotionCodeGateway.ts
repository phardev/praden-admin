import {
  CreatePromotionCodeDTO,
  PromotionCode
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { RealGateway } from '../order-gateways/RealOrderGateway'
import { PromotionCodeGateway } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCodeGateway'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { EditPromotionCodeDTO } from '@core/usecases/promotion-codes/promotion-code-edition/editPromotionCode'

export class RealPromotionCodeGateway
  extends RealGateway
  implements PromotionCodeGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<PromotionCode>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/promotion-codes`)
    return Promise.resolve(res.data)
  }

  async getByCode(code: string): Promise<PromotionCode> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/promotion-codes/${code}`
    )
    return Promise.resolve(res.data)
  }

  async create(dto: CreatePromotionCodeDTO): Promise<PromotionCode> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/promotion-codes`,
      JSON.stringify(dto),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return Promise.resolve(res.data)
  }

  async edit(code: string, dto: EditPromotionCodeDTO): Promise<PromotionCode> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/promotion-codes/${code}`,
      JSON.stringify(dto),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return Promise.resolve(res.data)
  }
}
