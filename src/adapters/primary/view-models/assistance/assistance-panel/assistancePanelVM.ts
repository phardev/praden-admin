import { pageSubjectFor } from '@adapters/primary/view-models/assistance/assistance-panel/pageSubject'
import type {
  AssistanceRequestCategory,
  AssistanceSubject
} from '@core/entities/assistanceRequest'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export interface AssistancePanelVM {
  pageSubject?: AssistanceSubject
  suggestedCategory?: AssistanceRequestCategory
  lastCreated?: { id: string; reference: string }
}

export const assistancePanelVM = (routePath: string): AssistancePanelVM => {
  const pageSubject = pageSubjectFor(routePath)
  const lastCreated = useAssistanceRequestStore().lastCreated
  return {
    pageSubject: pageSubject?.subject,
    suggestedCategory: pageSubject?.category,
    lastCreated: lastCreated
      ? { id: lastCreated.id, reference: lastCreated.reference }
      : undefined
  }
}
