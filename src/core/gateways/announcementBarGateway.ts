import { AnnouncementBar } from '@core/entities/announcementBar'
import { UUID } from '@core/types/types'

export interface CreateAnnouncementBarDTO {
  text: string
  isActive: boolean
  startDate?: string
  endDate?: string
}

export interface EditAnnouncementBarDTO {
  text: string
  isActive: boolean
  startDate?: string
  endDate?: string
}

export interface AnnouncementBarGateway {
  list(): Promise<Array<AnnouncementBar>>
  create(dto: CreateAnnouncementBarDTO): Promise<AnnouncementBar>
  edit(uuid: UUID, dto: EditAnnouncementBarDTO): Promise<AnnouncementBar>
  delete(uuid: UUID): Promise<void>
  getByUuid(uuid: UUID): Promise<AnnouncementBar>
}
