import type {
  AnnouncementBarGateway,
  CreateAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { listAnnouncementBars } from '@core/usecases/announcement-bar/list-announcement-bars/listAnnouncementBars'

export type { CreateAnnouncementBarDTO }

export const createAnnouncementBar = async (
  dto: CreateAnnouncementBarDTO,
  announcementBarGateway: AnnouncementBarGateway
) => {
  await announcementBarGateway.create(dto)
  await listAnnouncementBars(announcementBarGateway)
}
