import { Author } from '@core/entities/author'
import type { FooterSection } from '@core/entities/footer'
import { isKebabCase, slugFromText } from '@core/entities/slug'
import { Timestamp } from '@core/types/types'

export enum ContentPageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

const CONTENT_PAGE_MAX_SLUG_LENGTH = 200
export const CONTENT_PAGE_MAX_NAME_LENGTH = 60
export const CONTENT_PAGE_MAX_TITLE_LENGTH = 200
export const CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH = 320

export interface ContentPage {
  slug: string
  name: string
  title: string
  metaDescription: string
  html: string
  status: ContentPageStatus
  isMandatory: boolean
  footerSection?: FooterSection
  updatedAt: Timestamp
  updatedBy: string
}

export interface ContentPageListItem {
  slug: string
  name: string
  title: string
  status: ContentPageStatus
  isMandatory: boolean
  footerSection?: FooterSection
  updatedAt: Timestamp
  updatedBy: Author
}

export const isValidContentPageSlug = (slug: string): boolean => {
  return isKebabCase(slug)
}

export const contentPageSlugFromName = (name: string): string => {
  return slugFromText(name, CONTENT_PAGE_MAX_SLUG_LENGTH)
}
