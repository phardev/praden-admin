import { ContentPageSlug } from '@core/entities/contentPage'
import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const getContentPage = async (
  slug: ContentPageSlug,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startLoading()
  try {
    const contentPage = await contentPageGateway.getBySlug(slug)
    contentPageStore.setCurrent(contentPage)
  } finally {
    contentPageStore.stopLoading()
  }
}
