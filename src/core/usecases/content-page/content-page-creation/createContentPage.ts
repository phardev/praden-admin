import type {
  ContentPageGateway,
  CreateContentPageDTO
} from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const createContentPage = async (
  dto: CreateContentPageDTO,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startSaving()
  try {
    const created = await contentPageGateway.create(dto)
    contentPageStore.setCurrent(created)
  } finally {
    contentPageStore.stopSaving()
  }
}
