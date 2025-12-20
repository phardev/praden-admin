import type {
  AnnouncementBarGateway,
  EditAnnouncementBarDTO
} from '@core/gateways/announcementBarGateway'
import { UUID } from '@core/types/types'
import { useAnnouncementBarStore } from '@store/announcementBarStore'

export type { EditAnnouncementBarDTO }

export const editAnnouncementBar = async (
  uuid: UUID,
  dto: EditAnnouncementBarDTO,
  announcementBarGateway: AnnouncementBarGateway
) => {
  const edited = await announcementBarGateway.edit(uuid, dto)
  const announcementBarStore = useAnnouncementBarStore()
  announcementBarStore.edit(edited)
}
