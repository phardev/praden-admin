import {
  type AssistanceMessageVM,
  type AssistanceRequestDetailsItemVM,
  type AssistanceRequestDetailsVM,
  type AssistanceStepperVM,
  assistanceRequestDetailsVM
} from '@adapters/primary/view-models/assistance/assistance-request-details/assistanceRequestDetailsVM'
import { KILO } from '@adapters/primary/view-models/assistance/shared/fileSize'
import type { TimeLabelVM } from '@adapters/primary/view-models/assistance/shared/timeLabels'
import type {
  AssistanceMessage,
  AssistanceRequestDetails
} from '@core/entities/assistanceRequest'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { assistanceNow } from '@utils/testData/assistanceNow'
import {
  cancelledRequest,
  inProgressSearchRequest,
  receivedLabelRequest,
  resolvedRelayRequest,
  waitingForAnswerPriceRequest
} from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

const yesterdayAt = (time: string): TimeLabelVM => ({
  key: 'assistance.time.yesterday',
  params: { time }
})

const todayAt = (time: string): TimeLabelVM => ({
  key: 'assistance.time.today',
  params: { time }
})

const dateTimeAt = (date: string, time: string): TimeLabelVM => ({
  key: 'assistance.time.dateTime',
  params: { date, time }
})

const toMessageVM = (
  message: AssistanceMessage,
  sentAt: TimeLabelVM,
  url?: string
): AssistanceMessageVM => ({
  id: message.id,
  author: message.author,
  isPharmacy: message.side === 'PHARMACY',
  content: message.content,
  hasContent: true,
  sentAt,
  attachments: message.attachments.map((attachment) => ({
    id: attachment.id,
    filename: attachment.filename,
    formattedSize: {
      key: 'assistance.size.kilo',
      params: { n: attachment.size / KILO }
    },
    isImage: true,
    url
  }))
})

interface ExpectedItemState {
  createdAt: string
  openPageKey: string | undefined
  stepper: AssistanceStepperVM
  canReply: boolean
  canResolve: boolean
  replyToName: string | undefined
  messages: Array<AssistanceMessageVM>
}

const toItemVM = (
  request: AssistanceRequestDetails,
  state: ExpectedItemState
): AssistanceRequestDetailsItemVM => ({
  id: request.id,
  reference: `#${request.reference}`,
  title: request.title,
  status: request.status,
  category: request.category,
  subjectLabel: request.subject?.label,
  subjectPageUrl: request.subject?.pageUrl,
  openPageKey: state.openPageKey,
  author: request.author,
  createdAt: state.createdAt,
  stepper: state.stepper,
  canReply: state.canReply,
  canResolve: state.canResolve,
  replyToName: state.replyToName,
  messages: state.messages
})

const expectedMessages = (url?: string): Array<AssistanceMessageVM> => {
  const [report, firstReply, sophieReply, lastReply] =
    waitingForAnswerPriceRequest.messages
  return [
    toMessageVM(report, yesterdayAt('09:12')),
    toMessageVM(firstReply, yesterdayAt('10:05')),
    toMessageVM(sophieReply, yesterdayAt('10:20')),
    toMessageVM(lastReply, yesterdayAt('16:40'), url)
  ]
}

const expectedWaitingForAnswerItem = (
  url?: string
): AssistanceRequestDetailsItemVM =>
  toItemVM(waitingForAnswerPriceRequest, {
    createdAt: '2 sept. 2026, 09:12',
    openPageKey: 'assistance.details.openPage.product',
    stepper: { current: 1, isCancelled: false },
    canReply: true,
    canResolve: true,
    replyToName: 'Cédric',
    messages: expectedMessages(url)
  })

describe('Assistance request details VM', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
  })

  describe('Given there is no current request', () => {
    it('should have no item', () => {
      const expected: AssistanceRequestDetailsVM = {
        isLoading: false,
        item: undefined
      }
      expect(assistanceRequestDetailsVM(assistanceNow)).toStrictEqual(expected)
    })
  })

  describe('Given the current request is waiting for an answer', () => {
    beforeEach(() => {
      store.setCurrent(waitingForAnswerPriceRequest)
    })

    it('should present the full thread', () => {
      expect(assistanceRequestDetailsVM(assistanceNow).item).toStrictEqual(
        expectedWaitingForAnswerItem()
      )
    })

    it('should expose the loaded attachment url', () => {
      const url = 'data:image/png;base64,iVBORw0KGgo='
      store.setAttachmentUrl('attachment-1', url)
      expect(assistanceRequestDetailsVM(assistanceNow).item).toStrictEqual(
        expectedWaitingForAnswerItem(url)
      )
    })

    it('should show the date and time of older messages', () => {
      const twoDaysLater = assistanceNow + 2 * 24 * 60 * 60 * 1000
      expect(
        assistanceRequestDetailsVM(twoDaysLater).item?.messages[0].sentAt
      ).toStrictEqual(dateTimeAt('2 sept.', '09:12'))
    })

    it('should show the year of messages from a previous year', () => {
      const nextYear = Date.UTC(2027, 0, 15, 10, 0)
      expect(
        assistanceRequestDetailsVM(nextYear).item?.messages[0].sentAt
      ).toStrictEqual(dateTimeAt('2 sept. 2026', '09:12'))
    })
  })

  describe('Given a message made of an image only', () => {
    it('should have no content to display', () => {
      const [report] = waitingForAnswerPriceRequest.messages
      store.setCurrent({
        ...waitingForAnswerPriceRequest,
        messages: [{ ...report, content: '' }]
      })
      expect(
        assistanceRequestDetailsVM(assistanceNow).item?.messages[0].hasContent
      ).toBe(false)
    })
  })

  describe('Given the current request is resolved', () => {
    it('should not allow replying nor resolving and be at the last step', () => {
      store.setCurrent(resolvedRelayRequest)
      const [report, reply] = resolvedRelayRequest.messages
      expect(assistanceRequestDetailsVM(assistanceNow).item).toStrictEqual(
        toItemVM(resolvedRelayRequest, {
          createdAt: '28 août 2026, 14:00',
          openPageKey: 'assistance.details.openPage.order',
          stepper: { current: 2, isCancelled: false },
          canReply: false,
          canResolve: false,
          replyToName: 'Cédric',
          messages: [
            toMessageVM(report, dateTimeAt('28 août', '14:00')),
            toMessageVM(reply, dateTimeAt('29 août', '09:15'))
          ]
        })
      )
    })
  })

  describe('Given the current request is cancelled', () => {
    it('should mark the stepper as cancelled', () => {
      store.setCurrent(cancelledRequest)
      const [report] = cancelledRequest.messages
      expect(assistanceRequestDetailsVM(assistanceNow).item).toStrictEqual(
        toItemVM(cancelledRequest, {
          createdAt: '20 août 2026, 09:00',
          openPageKey: undefined,
          stepper: { current: 1, isCancelled: true },
          canReply: false,
          canResolve: false,
          replyToName: undefined,
          messages: [toMessageVM(report, dateTimeAt('20 août', '09:00'))]
        })
      )
    })
  })

  describe('Given the current request has just been received', () => {
    it('should have nobody to reply to and be at the first step', () => {
      store.setCurrent(receivedLabelRequest)
      const [report] = receivedLabelRequest.messages
      expect(assistanceRequestDetailsVM(assistanceNow).item).toStrictEqual(
        toItemVM(receivedLabelRequest, {
          createdAt: '3 sept. 2026, 09:58',
          openPageKey: 'assistance.details.openPage.order',
          stepper: { current: 0, isCancelled: false },
          canReply: true,
          canResolve: true,
          replyToName: undefined,
          messages: [toMessageVM(report, todayAt('09:58'))]
        })
      )
    })
  })

  describe('Given the current request has no subject', () => {
    it('should have no page to open', () => {
      store.setCurrent(inProgressSearchRequest)
      const [report] = inProgressSearchRequest.messages
      expect(assistanceRequestDetailsVM(assistanceNow).item).toStrictEqual(
        toItemVM(inProgressSearchRequest, {
          createdAt: '31 août 2026, 08:30',
          openPageKey: undefined,
          stepper: { current: 1, isCancelled: false },
          canReply: true,
          canResolve: true,
          replyToName: undefined,
          messages: [toMessageVM(report, dateTimeAt('31 août', '08:30'))]
        })
      )
    })
  })

  describe('Given the current request is loading', () => {
    it('should be loading', () => {
      store.startLoadingCurrent()
      expect(assistanceRequestDetailsVM(assistanceNow).isLoading).toBe(true)
    })
  })
})
