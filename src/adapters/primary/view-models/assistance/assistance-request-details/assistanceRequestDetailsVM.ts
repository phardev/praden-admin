import {
  type FileSizeLabelVM,
  formatFileSize
} from '@adapters/primary/view-models/assistance/shared/fileSize'
import {
  formatFullDateTime,
  formatMessageTime,
  type TimeLabelVM
} from '@adapters/primary/view-models/assistance/shared/timeLabels'
import {
  type AssistanceAttachment,
  type AssistanceMessage,
  AssistanceMessageSide,
  type AssistanceRequestCategory,
  type AssistanceRequestDetails,
  AssistanceRequestStatus,
  type AssistanceSubject
} from '@core/entities/assistanceRequest'
import type { HashTable, Timestamp } from '@core/types/types'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'

export interface AssistanceAttachmentItemVM {
  id: string
  filename: string
  formattedSize: FileSizeLabelVM
  isImage: boolean
  url?: string
}

export interface AssistanceMessageVM {
  id: string
  author: string
  isPharmacy: boolean
  content: string
  hasContent: boolean
  sentAt: TimeLabelVM
  attachments: Array<AssistanceAttachmentItemVM>
}

export interface AssistanceStepperVM {
  current: 0 | 1 | 2
  isCancelled: boolean
}

export interface AssistanceRequestDetailsItemVM {
  id: string
  reference: string
  title: string
  status: AssistanceRequestStatus
  category: AssistanceRequestCategory
  subjectLabel?: string
  subjectPageUrl?: string
  openPageKey?: string
  author: string
  createdAt: string
  stepper: AssistanceStepperVM
  canReply: boolean
  canResolve: boolean
  replyToName?: string
  messages: Array<AssistanceMessageVM>
}

export interface AssistanceRequestDetailsVM {
  isLoading: boolean
  item?: AssistanceRequestDetailsItemVM
}

const stepperByStatus: Record<AssistanceRequestStatus, AssistanceStepperVM> = {
  [AssistanceRequestStatus.RECEIVED]: { current: 0, isCancelled: false },
  [AssistanceRequestStatus.IN_PROGRESS]: { current: 1, isCancelled: false },
  [AssistanceRequestStatus.WAITING_FOR_YOUR_ANSWER]: {
    current: 1,
    isCancelled: false
  },
  [AssistanceRequestStatus.ON_HOLD]: { current: 1, isCancelled: false },
  [AssistanceRequestStatus.RESOLVED]: { current: 2, isCancelled: false },
  [AssistanceRequestStatus.CANCELLED]: { current: 1, isCancelled: true }
}

const closedStatuses: Array<AssistanceRequestStatus> = [
  AssistanceRequestStatus.RESOLVED,
  AssistanceRequestStatus.CANCELLED
]

const isOpen = (status: AssistanceRequestStatus): boolean =>
  !closedStatuses.includes(status)

const openPageKeyFor = (subject?: AssistanceSubject): string | undefined =>
  subject
    ? `assistance.details.openPage.${subject.type.toLowerCase()}`
    : undefined

const firstWord = (name: string): string => name.trim().split(/\s+/)[0]

const replyToNameFor = (
  messages: Array<AssistanceMessage>
): string | undefined => {
  const lastPhardevMessage = [...messages]
    .reverse()
    .find((message) => message.side === AssistanceMessageSide.PHARDEV)
  return lastPhardevMessage ? firstWord(lastPhardevMessage.author) : undefined
}

const toAttachmentVM = (
  attachment: AssistanceAttachment,
  attachmentUrls: HashTable<string>
): AssistanceAttachmentItemVM => ({
  id: attachment.id,
  filename: attachment.filename,
  formattedSize: formatFileSize(attachment.size),
  isImage: attachment.mimeType.startsWith('image/'),
  url: attachmentUrls[attachment.id]
})

const toMessageVM = (
  message: AssistanceMessage,
  now: Timestamp,
  attachmentUrls: HashTable<string>
): AssistanceMessageVM => ({
  id: message.id,
  author: message.author,
  isPharmacy: message.side === AssistanceMessageSide.PHARMACY,
  content: message.content,
  hasContent: message.content.trim() !== '',
  sentAt: formatMessageTime(message.sentAt, now),
  attachments: message.attachments.map((attachment) =>
    toAttachmentVM(attachment, attachmentUrls)
  )
})

const toItemVM = (
  details: AssistanceRequestDetails,
  now: Timestamp,
  attachmentUrls: HashTable<string>
): AssistanceRequestDetailsItemVM => ({
  id: details.id,
  reference: `#${details.reference}`,
  title: details.title,
  status: details.status,
  category: details.category,
  subjectLabel: details.subject?.label,
  subjectPageUrl: details.subject?.pageUrl,
  openPageKey: openPageKeyFor(details.subject),
  author: details.author,
  createdAt: formatFullDateTime(details.createdAt),
  stepper: stepperByStatus[details.status],
  canReply: isOpen(details.status),
  canResolve: isOpen(details.status),
  replyToName: replyToNameFor(details.messages),
  messages: details.messages.map((message) =>
    toMessageVM(message, now, attachmentUrls)
  )
})

export const assistanceRequestDetailsVM = (
  now: Timestamp
): AssistanceRequestDetailsVM => {
  const store = useAssistanceRequestStore()
  return {
    isLoading: store.isLoadingCurrent,
    item: store.current
      ? toItemVM(store.current, now, store.attachmentUrls)
      : undefined
  }
}
