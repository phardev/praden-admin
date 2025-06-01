import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Banner } from '@core/entities/banner'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { UUID } from '@core/types/types'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealBannerGateway extends RealGateway implements BannerGateway {
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Banner>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/banners`)
    return res.data.items.map(this.convertToBanner)
  }

  async reorder(bannerUuids: Array<UUID>): Promise<Array<Banner>> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/banners/reorder`, {
      uuids: bannerUuids
    })
    return res.data.items.map(this.convertToBanner)
  }

  async delete(uuid: UUID): Promise<Banner> {
    const res = await axiosWithBearer.delete(`${this.baseUrl}/banners/${uuid}`)
    return this.convertToBanner(res.data.item)
  }

  async create(dto: CreateBannerDTO): Promise<Array<Banner>> {
    const formData = this.createFormData(dto)
    formData.append('image', dto.img)
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/banners`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return [this.convertToBanner(res.data.item)]
  }

  async edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner> {
    const { img, ...editDTO } = dto
    const formData = new FormData()
    if (img) {
      formData.append('image', img)
    }
    formData.append('data', JSON.stringify(editDTO))
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/banners/${uuid}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return this.convertToBanner(res.data.item)
  }

  async get(uuid: UUID): Promise<Banner> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/banners/${uuid}`)
    return this.convertToBanner(res.data.item)
  }

  private convertToBanner(banner: any): Banner {
    return {
      uuid: banner.uuid,
      img: banner.image,
      order: banner.order,
      isActive: banner.isActive,
      href: banner.href,
      startDate: banner.startDate,
      endDate: banner.endDate
    }
  }
}
