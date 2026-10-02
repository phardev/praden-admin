import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const removeContentPageFromFooter = async (
  slug: string,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startSaving()
  try {
    await contentPageGateway.removeFromFooter(slug)
    contentPageStore.applyFooterSection(slug, undefined)
  } finally {
    contentPageStore.stopSaving()
  }
}
