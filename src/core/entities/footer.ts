import type { ContentPageStatus } from '@core/entities/contentPage'
import { UUID } from '@core/types/types'

export enum FooterSection {
  PHARMACY = 'PHARMACY',
  LEGAL = 'LEGAL'
}

export enum FooterEntryKind {
  PAGE = 'PAGE',
  SYSTEM = 'SYSTEM'
}

export interface PageFooterEntry {
  uuid: UUID
  kind: FooterEntryKind.PAGE
  pageSlug: string
  name: string
  status: ContentPageStatus
  isMandatory: boolean
}

export interface SystemFooterEntry {
  uuid: UUID
  kind: FooterEntryKind.SYSTEM
  systemKey: string
}

export type FooterEntry = PageFooterEntry | SystemFooterEntry

export interface FooterSectionEntries {
  section: FooterSection
  entries: Array<FooterEntry>
}

export interface Footer {
  sections: Array<FooterSectionEntries>
}
