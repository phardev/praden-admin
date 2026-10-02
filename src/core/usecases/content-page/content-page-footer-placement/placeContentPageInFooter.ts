import { FooterSection } from '@core/entities/footer'
import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { useContentPageStore } from '@store/contentPageStore'

export const placeContentPageInFooter = async (
  slug: string,
  section: FooterSection,
  contentPageGateway: ContentPageGateway
) => {
  const contentPageStore = useContentPageStore()
  contentPageStore.startSaving()
  try {
    await contentPageGateway.placeInFooter(slug, section)
    contentPageStore.applyFooterSection(slug, section)
  } finally {
    contentPageStore.stopSaving()
  }
}
