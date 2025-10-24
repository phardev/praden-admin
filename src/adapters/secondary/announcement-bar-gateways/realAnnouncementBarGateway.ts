import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { AnnouncementBar } from '@core/entities/announcementBar'
import {
  AnnouncementBarGateway,
  CreateAnnouncementBarDTO,
  EditAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { UUID } from '@core/types/types'

export class RealAnnouncementBarGateway
  extends RealGateway
  implements AnnouncementBarGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<AnnouncementBar>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/announcements`)
    return res.data.items.map(this.convertToAnnouncementBar)
  }

  async create(dto: CreateAnnouncementBarDTO): Promise<AnnouncementBar> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/announcements`, {
      ...dto,
      content: dto.text
    })
    return this.convertToAnnouncementBar(res.data.item)
  }

  async edit(
    uuid: UUID,
    dto: EditAnnouncementBarDTO
  ): Promise<AnnouncementBar> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/announcements/${uuid}`,
      {
        ...dto,
        content: dto.text
      }
    )
    return this.convertToAnnouncementBar(res.data.item)
  }

  async delete(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/announcements/${uuid}`)
  }

  async getByUuid(uuid: UUID): Promise<AnnouncementBar> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/announcements/${uuid}`
    )
    return this.convertToAnnouncementBar(res.data.item)
  }

  private convertToAnnouncementBar(data: any): AnnouncementBar {
    return {
      uuid: data.uuid,
      text: data.content,
      isActive: data.isActive,
      startDate: data.startDate,
      endDate: data.endDate,
      order: data.order
    }
  }
}
