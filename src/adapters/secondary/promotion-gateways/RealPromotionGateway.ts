import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion
} from '@core/entities/promotion'
import { PromotionStats } from '@core/entities/promotionStats'
import { PromotionGateway } from '@core/gateways/promotionGateway'
import { UUID } from '@core/types/types'
import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'

export class RealPromotionGateway
  extends RealGateway
  implements PromotionGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async getPromotionsForProduct(productUuid: UUID): Promise<Array<Promotion>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/products/${productUuid}/promotions`
    )
    return Promise.resolve(res.data.items)
  }

  async create(promotion: CreatePromotionDTO): Promise<Promotion> {
    const realDto = JSON.parse(JSON.stringify(promotion))
    delete realDto.products
    realDto.productUuids = promotion.products.map((p) => p.uuid)
    const formData = this.createFormData(realDto)
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/promotions`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return Promise.resolve(res.data.item)
  }

  async edit(uuid: UUID, promotion: EditPromotionDTO): Promise<Promotion> {
    const realDto = JSON.parse(JSON.stringify(promotion))
    delete realDto.products
    realDto.productUuids = promotion.products?.map((p) => p.uuid)
    const formData = this.createFormData(realDto)
    formData.append('uuid', uuid)
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/promotions/edit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return Promise.resolve(res.data.item)
  }

  async getByUuid(uuid: UUID): Promise<Promotion> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/promotions/${uuid}/`)
    return Promise.resolve(res.data.item)
  }

  async list(): Promise<Array<PromotionListItem>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/promotions/`)
    return res.data.items.sort((a: PromotionListItem, b: PromotionListItem) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
  }

  async getStats(uuid: UUID): Promise<PromotionStats> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/promotions/${uuid}/stats`
    )
    const backendData = res.data

    const domainStats: PromotionStats = {
      usageCount: backendData.totalUsage,
      totalSales: backendData.totalSales,
      totalDiscountGiven: backendData.totalReduction,
      productUsages: backendData.productStats.map((product: any) => ({
        productUuid: product.productUuid,
        name: product.productName,
        ean13: product.ean13,
        usageCount: product.quantitySold,
        totalAmountTaxIncluded: Math.round(product.totalWithTax),
        totalReductionTaxIncluded: Math.round(product.totalDiscount)
      }))
    }

    return Promise.resolve(domainStats)
  }

  async exportStatsPDF(uuid: UUID): Promise<Blob> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/promotions/${uuid}/stats/pdf`,
      { responseType: 'blob' }
    )
    return Promise.resolve(res.data)
  }
}
