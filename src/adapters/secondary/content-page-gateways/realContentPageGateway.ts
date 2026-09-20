import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  ContentPage,
  ContentPageListItem,
  ContentPageSlug
} from '@core/entities/contentPage'
import {
  ContentPageGateway,
  EditContentPageDTO
} from '@core/gateways/contentPageGateway'

export class RealContentPageGateway
  extends RealGateway
  implements ContentPageGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<ContentPageListItem>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/content-pages`)
    return res.data.items
  }

  async getBySlug(slug: ContentPageSlug): Promise<ContentPage> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/content-pages/${slug}`
    )
    return res.data.item
  }

  async edit(
    slug: ContentPageSlug,
    dto: EditContentPageDTO
  ): Promise<ContentPage> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/content-pages/${slug}`,
      dto
    )
    return res.data.item
  }
}
