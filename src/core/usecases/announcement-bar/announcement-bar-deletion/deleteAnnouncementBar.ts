import { UUID } from '@core/types/types'
import type { AnnouncementBarGateway } from '@core/gateways/announcementBarGateway'
import { useAnnouncementBarStore } from '@store/announcementBarStore'

export const deleteAnnouncementBar = async (
  uuid: UUID,
  announcementBarGateway: AnnouncementBarGateway
) => {
  await announcementBarGateway.delete(uuid)
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.remove(uuid)
}
