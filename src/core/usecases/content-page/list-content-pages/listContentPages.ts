import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const listContentPages = async (
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startLoading()
  try {
    const contentPages = await contentPageGateway.list()
    contentPageStore.list(contentPages)
  } finally {
    contentPageStore.stopLoading()
  }
}
