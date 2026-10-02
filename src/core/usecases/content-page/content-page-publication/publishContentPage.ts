import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const publishContentPage = async (
  slug: string,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startSaving()
  try {
    const contentPage = await contentPageGateway.publish(slug)
    contentPageStore.applyStatus(slug, contentPage.status)
  } finally {
    contentPageStore.stopSaving()
  }
}
