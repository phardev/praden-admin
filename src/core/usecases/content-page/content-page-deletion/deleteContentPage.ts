import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const deleteContentPage = async (
  slug: string,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startDeleting()
  try {
    await contentPageGateway.delete(slug)
    contentPageStore.remove(slug)
  } finally {
    contentPageStore.stopDeleting()
  }
}
