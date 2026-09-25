import type {
  AnnouncementBarGateway,
  EditAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { UUID } from '@core/types/types'
import { listAnnouncementBars } from '@core/usecases/announcement-bar/list-announcement-bars/listAnnouncementBars'

export type { EditAnnouncementBarDTO }

export const editAnnouncementBar = async (
  uuid: UUID,
  dto: EditAnnouncementBarDTO,
  announcementBarGateway: AnnouncementBarGateway
) => {
  await announcementBarGateway.edit(uuid, dto)
  await listAnnouncementBars(announcementBarGateway)
}
