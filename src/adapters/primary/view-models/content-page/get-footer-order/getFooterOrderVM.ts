import { ContentPageStatus } from '@core/entities/contentPage'
import {
  FooterEntry,
  FooterEntryKind,
  FooterSection
} from '@core/entities/footer'
import { UUID } from '@core/types/types'
import { useFooterStore } from '@store/footerStore'

export interface FooterOrderEntryVM {
  uuid: UUID
  isSystem: boolean
  name: string
  systemKey: string
  isLocked: boolean
  isDraft: boolean
}

export interface FooterOrderSectionVM {
  section: FooterSection
  entries: Array<FooterOrderEntryVM>
}

export interface GetFooterOrderVM {
  isLoading: boolean
  isSaving: boolean
  sections: Array<FooterOrderSectionVM>
}

export const getFooterOrderVM = (): GetFooterOrderVM => {
  const footerStore = useFooterStore()
  return {
    isLoading: footerStore.isLoading,
    isSaving: footerStore.isSaving,
    sections: footerStore.footer.sections.map((current) => ({
      section: current.section,
      entries: current.entries.map(getFooterOrderEntryVM)
    }))
  }
}

const getFooterOrderEntryVM = (entry: FooterEntry): FooterOrderEntryVM => {
  if (entry.kind === FooterEntryKind.SYSTEM) {
    return {
      uuid: entry.uuid,
      isSystem: true,
      name: '',
      systemKey: entry.systemKey,
      isLocked: true,
      isDraft: false
    }
  }
  return {
    uuid: entry.uuid,
    isSystem: false,
    name: entry.name,
    systemKey: '',
    isLocked: entry.isMandatory,
    isDraft: entry.status === ContentPageStatus.DRAFT
  }
}
