import { useAnnouncementBarStore } from '@store/announcementBarStore'
import type { AnnouncementBarGateway } from '@core/gateways/announcementBarGateway'

export const listAnnouncementBars = async (
  announcementBarGateway: AnnouncementBarGateway
) => {
  const announcementBars = await announcementBarGateway.list()
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.list(announcementBars)
}
