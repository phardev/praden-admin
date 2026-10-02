import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ContentPage, ContentPageListItem } from '@core/entities/contentPage'
import { FooterSection } from '@core/entities/footer'
import {
  ContentPageGateway,
  CreateContentPageDTO,
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

  async getBySlug(slug: string): Promise<ContentPage> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/content-pages/${slug}`
    )
    return res.data.item
  }

  async create(dto: CreateContentPageDTO): Promise<ContentPage> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/content-pages`, dto)
    return res.data.item
  }

  async edit(slug: string, dto: EditContentPageDTO): Promise<ContentPage> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/content-pages/${slug}`,
      dto
    )
    return res.data.item
  }

  async delete(slug: string): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/content-pages/${slug}`)
  }

  async publish(slug: string): Promise<ContentPage> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/content-pages/${slug}/publish`
    )
    return res.data.item
  }

  async unpublish(slug: string): Promise<ContentPage> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/content-pages/${slug}/unpublish`
    )
    return res.data.item
  }

  async placeInFooter(slug: string, section: FooterSection): Promise<void> {
    await axiosWithBearer.put(`${this.baseUrl}/content-pages/${slug}/footer`, {
      section
    })
  }

  async removeFromFooter(slug: string): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/content-pages/${slug}/footer`)
  }
}
