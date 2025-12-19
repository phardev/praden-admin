import type {
  AnnouncementBarGateway,
  CreateAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { useAnnouncementBarStore } from '@store/announcementBarStore'

export type { CreateAnnouncementBarDTO }

export const createAnnouncementBar = async (
  dto: CreateAnnouncementBarDTO,
  announcementBarGateway: AnnouncementBarGateway
) => {
  const added = await announcementBarGateway.create(dto)
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.list([...announcementBarStore.items, added])
}
