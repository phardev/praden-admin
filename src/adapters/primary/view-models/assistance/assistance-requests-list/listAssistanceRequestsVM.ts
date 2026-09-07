import {
  formatLastActivity,
  type TimeLabelVM
} from '@adapters/primary/view-models/assistance/shared/timeLabels'
import type { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import {
  type AssistanceRequest,
  type AssistanceRequestCategory,
  AssistanceRequestStatus
} from '@core/entities/assistanceRequest'
import type { Timestamp } from '@core/types/types'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export interface AssistanceRequestRowVM {
  id: string
  reference: string
  category: AssistanceRequestCategory
  subjectLabel?: string
  subjectPageUrl?: string
  title: string
  author: string
  status: AssistanceRequestStatus
  lastActivity: TimeLabelVM
  lastActivityAt: Timestamp
}

export interface AssistanceRequestTabVM {
  count: number
  items: Array<AssistanceRequestRowVM>
}

export interface ListAssistanceRequestsVM {
  headers: Array<Header>
  open: AssistanceRequestTabVM
  resolved: AssistanceRequestTabVM
  isLoading: boolean
}

const headers: Array<Header> = [
  { name: 'assistance.columns.reference', value: 'reference' },
  { name: 'assistance.columns.subject', value: 'subject' },
  { name: 'assistance.columns.title', value: 'problem' },
  { name: 'assistance.columns.author', value: 'author' },
  { name: 'assistance.columns.status', value: 'status' },
  { name: 'assistance.columns.lastActivity', value: 'lastActivity' }
]

const closedStatuses: Array<AssistanceRequestStatus> = [
  AssistanceRequestStatus.RESOLVED,
  AssistanceRequestStatus.CANCELLED
]

const isClosed = (request: AssistanceRequest): boolean =>
  closedStatuses.includes(request.status)

const byLastActivityDesc = (
  a: AssistanceRequest,
  b: AssistanceRequest
): number => b.lastActivityAt - a.lastActivityAt

const toRow = (
  request: AssistanceRequest,
  now: Timestamp
): AssistanceRequestRowVM => ({
  id: request.id,
  reference: `#${request.reference}`,
  category: request.category,
  subjectLabel: request.subject?.label,
  subjectPageUrl: request.subject?.pageUrl,
  title: request.title,
  author: request.author,
  status: request.status,
  lastActivity: formatLastActivity(request.lastActivityAt, now),
  lastActivityAt: request.lastActivityAt
})

const toTab = (
  requests: Array<AssistanceRequest>,
  now: Timestamp
): AssistanceRequestTabVM => {
  const items = [...requests]
    .sort(byLastActivityDesc)
    .map((request) => toRow(request, now))
  return { count: items.length, items }
}

export const listAssistanceRequestsVM = (
  now: Timestamp
): ListAssistanceRequestsVM => {
  const store = useAssistanceRequestStore()
  return {
    headers,
    open: toTab(
      store.items.filter((request) => !isClosed(request)),
      now
    ),
    resolved: toTab(store.items.filter(isClosed), now),
    isLoading: store.isLoading
  }
}
