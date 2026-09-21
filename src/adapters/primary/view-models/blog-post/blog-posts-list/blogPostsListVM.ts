import { Author } from '@core/entities/author'
import { BlogPostListItem, BlogPostStatus } from '@core/entities/blogPost'
import { Timestamp, UUID } from '@core/types/types'
import { useBlogPostStore } from '@store/blogPostStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface BlogPostListItemVM {
  uuid: UUID
  slug: string
  title: string
  imageUrl: string
  status: BlogPostStatus
  isPublished: boolean
  publishedAt: string
  updatedAt: string
  authorKind: Author['kind']
  authorName: string
  isHighlighted: boolean
}

interface BlogPostsListVM {
  isLoading: boolean
  isSaving: boolean
  isDeleting: boolean
  highlighted: Array<BlogPostListItemVM>
  others: Array<BlogPostListItemVM>
  highlightedUuids: Array<UUID>
}

const isHighlighted = (item: BlogPostListItem): boolean =>
  item.highlightOrder !== undefined

const byHighlightOrder = (a: BlogPostListItem, b: BlogPostListItem): number =>
  a.highlightOrder! - b.highlightOrder!

const authorName = (author: Author): string => {
  if (author.kind !== 'staff') return ''
  const fullName = [author.firstname, author.lastname]
    .filter((part) => part && part.length > 0)
    .join(' ')
  return fullName.length > 0 ? fullName : author.email
}

const formatDate = (timestamp: Timestamp): string =>
  timestampToLocaleString(timestamp, 'fr-FR')

const toItemVM = (item: BlogPostListItem): BlogPostListItemVM => {
  return {
    uuid: item.uuid,
    slug: item.slug,
    title: item.title,
    imageUrl: item.imageUrl,
    status: item.status,
    isPublished: item.status === BlogPostStatus.PUBLISHED,
    publishedAt: formatDate(item.publishedAt),
    updatedAt: formatDate(item.updatedAt),
    authorKind: item.updatedBy.kind,
    authorName: authorName(item.updatedBy),
    isHighlighted: isHighlighted(item)
  }
}

export const blogPostsListVM = (): BlogPostsListVM => {
  const blogPostStore = useBlogPostStore()
  const highlightedItems = blogPostStore.items
    .filter(isHighlighted)
    .sort(byHighlightOrder)

  return {
    isLoading: blogPostStore.isLoading,
    isSaving: blogPostStore.isSaving,
    isDeleting: blogPostStore.isDeleting,
    highlighted: highlightedItems.map(toItemVM),
    others: blogPostStore.items
      .filter((item) => !isHighlighted(item))
      .map(toItemVM),
    highlightedUuids: highlightedItems.map((item) => item.uuid)
  }
}
