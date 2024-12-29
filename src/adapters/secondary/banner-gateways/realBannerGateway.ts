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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reorder(bannerUuids: Array<UUID>): Promise<Array<Banner>> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(uuid: UUID): Promise<Banner> {
    throw new Error('Method not implemented.')
  }

  async create(dto: CreateBannerDTO): Promise<Array<Banner>> {
    const formData = this.createFormData(dto)
    formData.append('image', dto.img)
    console.log('formData[isActive]: ', formData.get('isActive'))
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner> {
    throw new Error('Method not implemented.')
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
