import type { AnnouncementBarGateway } from '@core/gateways/announcementBarGateway'
import { UUID } from '@core/types/types'
import { useAnnouncementBarStore } from '@store/announcementBarStore'

export const getAnnouncementBar = async (
  uuid: UUID,
  announcementBarGateway: AnnouncementBarGateway
): Promise<void> => {
  const announcementBar = await announcementBarGateway.getByUuid(uuid)
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.setCurrent(announcementBar)
}
