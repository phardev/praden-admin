import {
  CONTENT_PAGE_SLUGS,
  ContentPageAuthor,
  ContentPageListItem,
  ContentPageSlug
} from '@core/entities/contentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface GetContentPagesItemVM {
  slug: ContentPageSlug
  title: string
  updatedAt: string
  authorKind: ContentPageAuthor['kind']
  authorName: string
}

export interface GetContentPagesVM {
  isLoading: boolean
  items: Array<GetContentPagesItemVM>
}

export const getContentPagesVM = (): GetContentPagesVM => {
  const contentPageStore = useContentPageStore()
  const items = CONTENT_PAGE_SLUGS.map((slug) =>
    contentPageStore.items.find((p: ContentPageListItem) => p.slug === slug)
  )
    .filter((p): p is ContentPageListItem => p !== undefined)
    .map(getContentPagesItemVM)

  return {
    isLoading: contentPageStore.isLoading,
    items
  }
}

const getContentPagesItemVM = (
  contentPage: ContentPageListItem
): GetContentPagesItemVM => {
  return {
    slug: contentPage.slug,
    title: contentPage.title,
    updatedAt: timestampToLocaleString(contentPage.updatedAt, 'fr-FR'),
    authorKind: contentPage.updatedBy.kind,
    authorName: authorName(contentPage.updatedBy)
  }
}

const authorName = (author: ContentPageAuthor): string => {
  if (author.kind !== 'staff') return ''
  const fullName = [author.firstname, author.lastname]
    .filter((part) => part && part.length > 0)
    .join(' ')
  return fullName.length > 0 ? fullName : author.email
}
