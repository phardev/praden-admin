import { Author } from '@core/entities/author'
import { Timestamp, UUID } from '@core/types/types'

export enum BlogPostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

const BLOG_POST_MAX_SLUG_LENGTH = 200
export const BLOG_POST_MAX_TITLE_LENGTH = 200
export const BLOG_POST_MAX_META_TITLE_LENGTH = 200
export const BLOG_POST_MAX_META_DESCRIPTION_LENGTH = 320
export const BLOG_POST_MAX_TAGS = 10

export interface BlogPost {
  uuid: UUID
  slug: string
  title: string
  metaTitle?: string
  metaDescription: string
  imageUrl: string
  publishedAt: Timestamp
  tags: Array<string>
  status: BlogPostStatus
  html: string
}

export interface BlogPostListItem {
  uuid: UUID
  slug: string
  title: string
  imageUrl: string
  status: BlogPostStatus
  publishedAt: Timestamp
  updatedAt: Timestamp
  updatedBy: Author
  highlightOrder?: number
}

export const isValidBlogPostSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export const blogPostSlugFromTitle = (title: string): string => {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, BLOG_POST_MAX_SLUG_LENGTH)
}
