import { ContentPageSlug } from '@core/entities/contentPage'
import type {
  ContentPageGateway,
  EditContentPageDTO
} from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export type { EditContentPageDTO }

export const editContentPage = async (
  slug: ContentPageSlug,
  dto: EditContentPageDTO,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startSaving()
  try {
    const edited = await contentPageGateway.edit(slug, dto)
    contentPageStore.edit(edited)
  } finally {
    contentPageStore.stopSaving()
  }
}
