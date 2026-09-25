import type {
  AnnouncementBarDraft,
  AnnouncementBarGateway
} from '@core/gateways/announcementBarGateway'
import { useAnnouncementBarStore } from '@store/announcementBarStore'

export const previewAnnouncementBarSchedule = async (
  draft: AnnouncementBarDraft,
  announcementBarGateway: AnnouncementBarGateway
) => {
  const impact = await announcementBarGateway.previewSchedule(draft)
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.setImpact(impact)
}
