import type { ContentPageFormVM } from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import { NO_FOOTER_SECTION } from '@adapters/primary/view-models/content-page/content-page-form/contentPageFormVM'
import { ContentPageStatus } from '@core/entities/contentPage'
import type { ContentPageGateway } from '@core/gateways/contentPageGateway'
import { placeContentPageInFooter } from '@core/usecases/content-page/content-page-footer-placement/placeContentPageInFooter'
import { removeContentPageFromFooter } from '@core/usecases/content-page/content-page-footer-placement/removeContentPageFromFooter'
import { publishContentPage } from '@core/usecases/content-page/content-page-publication/publishContentPage'
import { unpublishContentPage } from '@core/usecases/content-page/content-page-publication/unpublishContentPage'

type ContentPageTransitions = Pick<
  ContentPageFormVM,
  'getStatusTransition' | 'getFooterTransition'
>

export const useContentPageTransitions = (
  contentPageGateway: ContentPageGateway
) => {
  const applyStatusTransition = async (
    slug: string,
    formVM: ContentPageTransitions
  ) => {
    const transition = formVM.getStatusTransition()
    if (transition === undefined) return
    if (transition === ContentPageStatus.PUBLISHED) {
      await publishContentPage(slug, contentPageGateway)
      return
    }
    await unpublishContentPage(slug, contentPageGateway)
  }

  const applyFooterTransition = async (
    slug: string,
    formVM: ContentPageTransitions
  ) => {
    const transition = formVM.getFooterTransition()
    if (transition === undefined) return
    if (transition === NO_FOOTER_SECTION) {
      await removeContentPageFromFooter(slug, contentPageGateway)
      return
    }
    await placeContentPageInFooter(slug, transition, contentPageGateway)
  }

  const applyTransitions = async (
    slug: string,
    formVM: ContentPageTransitions
  ) => {
    await applyStatusTransition(slug, formVM)
    await applyFooterTransition(slug, formVM)
  }

  return { applyTransitions }
}
