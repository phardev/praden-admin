import {
  AnnouncementBar,
  AnnouncementBarImpact,
  AnnouncementBarsListing
} from '@core/entities/announcementBar'
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

export interface AnnouncementBarDraft {
  uuid?: UUID
  isActive: boolean
  startDate?: string
  endDate?: string
}

export interface AnnouncementBarGateway {
  list(): Promise<AnnouncementBarsListing>
  create(dto: CreateAnnouncementBarDTO): Promise<AnnouncementBar>
  edit(uuid: UUID, dto: EditAnnouncementBarDTO): Promise<AnnouncementBar>
  delete(uuid: UUID): Promise<void>
  getByUuid(uuid: UUID): Promise<AnnouncementBar>
  previewSchedule(draft: AnnouncementBarDraft): Promise<AnnouncementBarImpact>
}
