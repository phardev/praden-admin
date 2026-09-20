import { Timestamp } from '@core/types/types'

export enum ContentPageSlug {
  CGV = 'cgv',
  MENTIONS_LEGALES = 'mentions-legales',
  CONFIDENTIALITE = 'confidentialite',
  PAIEMENT = 'paiement',
  PHARMACIE = 'pharmacie',
  ENGAGEMENT = 'engagement',
  RECRUTEMENT = 'recrutement',
  ARTICLE = 'article'
}

export const CONTENT_PAGE_SLUGS: Array<ContentPageSlug> =
  Object.values(ContentPageSlug)

export const CONTENT_PAGE_MAX_TITLE_LENGTH = 200
export const CONTENT_PAGE_MAX_META_DESCRIPTION_LENGTH = 320

export interface ContentPage {
  slug: ContentPageSlug
  title: string
  metaDescription: string
  html: string
  updatedAt: Timestamp
  updatedBy: string
}

export type ContentPageAuthor =
  | { kind: 'staff'; email: string; firstname?: string; lastname?: string }
  | { kind: 'system' }
  | { kind: 'unknown' }

export interface ContentPageListItem {
  slug: ContentPageSlug
  title: string
  updatedAt: Timestamp
  updatedBy: ContentPageAuthor
}
