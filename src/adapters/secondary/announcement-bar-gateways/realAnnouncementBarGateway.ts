import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  AnnouncementBar,
  AnnouncementBarImpact,
  AnnouncementBarImpactPeriod,
  AnnouncementBarsListing
} from '@core/entities/announcementBar'
import {
  AnnouncementBarDraft,
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

  async list(): Promise<AnnouncementBarsListing> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/announcements`)
    return {
      items: res.data.items.map(this.convertToAnnouncementBar),
      displayedUuid: res.data.displayedUuid,
      schedule: res.data.schedule
    }
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

  async previewSchedule(
    draft: AnnouncementBarDraft
  ): Promise<AnnouncementBarImpact> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/announcements/schedule-preview`,
      { params: { ...draft, isActive: String(draft.isActive) } }
    )
    return {
      replaces: res.data.replaces.map(this.convertToImpactPeriod),
      maskedBy: res.data.maskedBy.map(this.convertToImpactPeriod)
    }
  }

  private convertToImpactPeriod(data: any): AnnouncementBarImpactPeriod {
    return {
      from: data.from,
      to: data.to,
      uuid: data.uuid,
      text: data.content
    }
  }

  private convertToAnnouncementBar(data: any): AnnouncementBar {
    return {
      uuid: data.uuid,
      text: data.content,
      isActive: data.isActive,
      startDate: data.startDate,
      endDate: data.endDate
    }
  }
}
