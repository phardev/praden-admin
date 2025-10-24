import type { AnnouncementBarGateway } from '@core/gateways/announcementBarGateway'
import { useAnnouncementBarStore } from '@store/announcementBarStore'

export const listAnnouncementBars = async (
  announcementBarGateway: AnnouncementBarGateway
) => {
  const announcementBars = await announcementBarGateway.list()
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.list(announcementBars)
}
