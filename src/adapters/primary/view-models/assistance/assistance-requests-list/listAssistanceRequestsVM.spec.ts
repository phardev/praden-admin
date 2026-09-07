import {
  type AssistanceRequestRowVM,
  type ListAssistanceRequestsVM,
  listAssistanceRequestsVM
} from '@adapters/primary/view-models/assistance/assistance-requests-list/listAssistanceRequestsVM'
import type { TimeLabelVM } from '@adapters/primary/view-models/assistance/shared/timeLabels'
import type { AssistanceRequest } from '@core/entities/assistanceRequest'
import type { Timestamp } from '@core/types/types'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import {
  assistanceNow,
  receivedLabelMinutesAgo
} from '@utils/testData/assistanceNow'
import {
  cancelledRequest,
  inProgressSearchRequest,
  onHoldMailRequest,
  receivedLabelRequest,
  resolvedRelayRequest,
  waitingForAnswerPriceRequest
} from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

const headers = [
  { name: 'assistance.columns.reference', value: 'reference' },
  { name: 'assistance.columns.subject', value: 'subject' },
  { name: 'assistance.columns.title', value: 'problem' },
  { name: 'assistance.columns.author', value: 'author' },
  { name: 'assistance.columns.status', value: 'status' },
  { name: 'assistance.columns.lastActivity', value: 'lastActivity' }
]

const toRow = (
  request: AssistanceRequest,
  lastActivity: TimeLabelVM
): AssistanceRequestRowVM => ({
  id: request.id,
  reference: `#${request.reference}`,
  category: request.category,
  subjectLabel: request.subject?.label,
  subjectPageUrl: request.subject?.pageUrl,
  title: request.title,
  author: request.author,
  status: request.status,
  lastActivity,
  lastActivityAt: request.lastActivityAt
})

describe('List assistance requests VM', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
  })

  describe('Given there are no requests', () => {
    it('should have empty tabs', () => {
      const expected: ListAssistanceRequestsVM = {
        headers,
        open: { count: 0, items: [] },
        resolved: { count: 0, items: [] },
        isLoading: false
      }
      expect(listAssistanceRequestsVM(assistanceNow)).toStrictEqual(expected)
    })
  })

  describe('Given there are requests', () => {
    beforeEach(() => {
      store.setItems([
        cancelledRequest,
        inProgressSearchRequest,
        receivedLabelRequest,
        resolvedRelayRequest,
        onHoldMailRequest,
        waitingForAnswerPriceRequest
      ])
    })

    it('should list open requests by last activity with relative dates', () => {
      const expected = {
        count: 4,
        items: [
          toRow(receivedLabelRequest, {
            key: 'assistance.time.minutesAgo',
            params: { n: receivedLabelMinutesAgo }
          }),
          toRow(waitingForAnswerPriceRequest, {
            key: 'assistance.time.yesterday',
            params: { time: '16:40' }
          }),
          toRow(onHoldMailRequest, {
            key: 'assistance.time.date',
            params: { date: '1 sept.' }
          }),
          toRow(inProgressSearchRequest, {
            key: 'assistance.time.date',
            params: { date: '31 août' }
          })
        ]
      }
      expect(listAssistanceRequestsVM(assistanceNow).open).toStrictEqual(
        expected
      )
    })

    it('should list resolved and cancelled requests by last activity', () => {
      const expected = {
        count: 2,
        items: [
          toRow(resolvedRelayRequest, {
            key: 'assistance.time.date',
            params: { date: '29 août' }
          }),
          toRow(cancelledRequest, {
            key: 'assistance.time.date',
            params: { date: '20 août' }
          })
        ]
      }
      expect(listAssistanceRequestsVM(assistanceNow).resolved).toStrictEqual(
        expected
      )
    })

    it('should not have a subject on requests without one', () => {
      const row = listAssistanceRequestsVM(assistanceNow).open.items[3]
      expect(row).toStrictEqual(
        toRow(inProgressSearchRequest, {
          key: 'assistance.time.date',
          params: { date: '31 août' }
        })
      )
    })
  })

  describe('Given a request whose activity is a few hours old', () => {
    it('should count the hours', () => {
      const hours = 3
      const now: Timestamp =
        receivedLabelRequest.lastActivityAt + hours * 60 * 60 * 1000
      store.setItems([receivedLabelRequest])
      expect(
        listAssistanceRequestsVM(now).open.items[0].lastActivity
      ).toStrictEqual({ key: 'assistance.time.hoursAgo', params: { n: hours } })
    })
  })

  describe('Given a request whose activity is a few seconds old', () => {
    it('should say just now', () => {
      const now: Timestamp = receivedLabelRequest.lastActivityAt + 30 * 1000
      store.setItems([receivedLabelRequest])
      expect(
        listAssistanceRequestsVM(now).open.items[0].lastActivity
      ).toStrictEqual({ key: 'assistance.time.justNow', params: {} })
    })
  })

  describe('Given a request whose activity dates from a previous year', () => {
    it('should show the year', () => {
      const now: Timestamp = Date.UTC(2027, 0, 15, 10, 0)
      store.setItems([receivedLabelRequest])
      expect(
        listAssistanceRequestsVM(now).open.items[0].lastActivity
      ).toStrictEqual({
        key: 'assistance.time.date',
        params: { date: '3 sept. 2026' }
      })
    })
  })

  describe('Given the requests are loading', () => {
    it('should be loading', () => {
      store.startLoading()
      expect(listAssistanceRequestsVM(assistanceNow).isLoading).toBe(true)
    })
  })
})
