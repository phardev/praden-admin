import type { AnnouncementBarGateway } from '@core/gateways/announcementBarGateway'
import { UUID } from '@core/types/types'
import { listAnnouncementBars } from '@core/usecases/announcement-bar/list-announcement-bars/listAnnouncementBars'

export const deleteAnnouncementBar = async (
  uuid: UUID,
  announcementBarGateway: AnnouncementBarGateway
) => {
  await announcementBarGateway.delete(uuid)
  await listAnnouncementBars(announcementBarGateway)
}
