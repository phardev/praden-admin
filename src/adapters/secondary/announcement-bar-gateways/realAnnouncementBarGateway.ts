import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  AnnouncementBarGateway,
  CreateAnnouncementBarDTO,
  EditAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { AnnouncementBar } from '@core/entities/announcementBar'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { UUID } from '@core/types/types'

export class RealAnnouncementBarGateway
  extends RealGateway
  implements AnnouncementBarGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<AnnouncementBar>> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/shop-settings/announcement-bars`
    )
    return res.data.items.map(this.convertToAnnouncementBar)
  }

  async create(dto: CreateAnnouncementBarDTO): Promise<AnnouncementBar> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/shop-settings/announcement-bars`,
      dto
    )
    return this.convertToAnnouncementBar(res.data.item)
  }

  async edit(
    uuid: UUID,
    dto: EditAnnouncementBarDTO
  ): Promise<AnnouncementBar> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/shop-settings/announcement-bars/${uuid}`,
      dto
    )
    return this.convertToAnnouncementBar(res.data.item)
  }

  async delete(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(
      `${this.baseUrl}/shop-settings/announcement-bars/${uuid}`
    )
  }

  async getByUuid(uuid: UUID): Promise<AnnouncementBar> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/shop-settings/announcement-bars/${uuid}`
    )
    return this.convertToAnnouncementBar(res.data.item)
  }

  private convertToAnnouncementBar(data: any): AnnouncementBar {
    return {
      uuid: data.uuid,
      text: data.text,
      isActive: data.isActive,
      startDate: data.startDate,
      endDate: data.endDate,
      order: data.order
    }
  }
}
