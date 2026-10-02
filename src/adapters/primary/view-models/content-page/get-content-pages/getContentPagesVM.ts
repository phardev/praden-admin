import { Author } from '@core/entities/author'
import {
  ContentPageListItem,
  ContentPageStatus
} from '@core/entities/contentPage'
import { useContentPageStore } from '@store/contentPageStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface GetContentPagesItemVM {
  slug: string
  name: string
  title: string
  status: ContentPageStatus
  isMandatory: boolean
  canDelete: boolean
  updatedAt: string
  authorKind: Author['kind']
  authorName: string
}

export interface GetContentPagesVM {
  isLoading: boolean
  isDeleting: boolean
  items: Array<GetContentPagesItemVM>
}

export const getContentPagesVM = (): GetContentPagesVM => {
  const contentPageStore = useContentPageStore()
  return {
    isLoading: contentPageStore.isLoading,
    isDeleting: contentPageStore.isDeleting,
    items: contentPageStore.items.map(getContentPagesItemVM)
  }
}

const getContentPagesItemVM = (
  contentPage: ContentPageListItem
): GetContentPagesItemVM => {
  return {
    slug: contentPage.slug,
    name: contentPage.name,
    title: contentPage.title,
    status: contentPage.status,
    isMandatory: contentPage.isMandatory,
    canDelete: !contentPage.isMandatory,
    updatedAt: timestampToLocaleString(contentPage.updatedAt, 'fr-FR'),
    authorKind: contentPage.updatedBy.kind,
    authorName: authorName(contentPage.updatedBy)
  }
}

const authorName = (author: Author): string => {
  if (author.kind !== 'staff') return ''
  const fullName = [author.firstname, author.lastname]
    .filter((part) => part && part.length > 0)
    .join(' ')
  return fullName.length > 0 ? fullName : author.email
}
