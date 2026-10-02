import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const unpublishContentPage = async (
  slug: string,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startSaving()
  try {
    const contentPage = await contentPageGateway.unpublish(slug)
    contentPageStore.applyStatus(slug, contentPage.status)
  } finally {
    contentPageStore.stopSaving()
  }
}
