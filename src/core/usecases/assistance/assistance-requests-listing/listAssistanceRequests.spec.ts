import { InMemoryAssistanceRequestGateway } from '@adapters/secondary/assistance-request-gateways/InMemoryAssistanceRequestGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type {
  AssistanceRequest,
  AssistanceRequestDetails
} from '@core/entities/assistanceRequest'
import { listAssistanceRequests } from '@core/usecases/assistance/assistance-requests-listing/listAssistanceRequests'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import * as fixtures from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

const allRequests = Object.values(fixtures)

const toListItem = (details: AssistanceRequestDetails): AssistanceRequest => {
  return {
    id: details.id,
    reference: details.reference,
    category: details.category,
    ...(details.subject ? { subject: details.subject } : {}),
    title: details.title,
    author: details.author,
    status: details.status,
    createdAt: details.createdAt,
    lastActivityAt: details.lastActivityAt
  }
}

describe('List assistance requests', () => {
  let store: ReturnType<typeof useAssistanceRequestStore>
  let gateway: InMemoryAssistanceRequestGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAssistanceRequestStore()
    gateway = new InMemoryAssistanceRequestGateway(
      new FakeDateProvider(),
      new FakeUuidGenerator()
    )
  })

  describe('Given there are no requests', () => {
    it('should list nothing', async () => {
      await whenListAssistanceRequests()
      expect(store.items).toStrictEqual([])
    })
  })

  describe('Given there are some requests', () => {
    beforeEach(async () => {
      givenExistingRequests(...allRequests)
      await whenListAssistanceRequests()
    })

    it('should list all of them without their thread', () => {
      expect(store.items).toStrictEqual(allRequests.map(toListItem))
    })
  })

  describe('Loading', () => {
    it('should set loading state during operation', async () => {
      let isLoadingDuringOperation = false
      const unsubscribe = store.$subscribe((_mutation, state) => {
        if (state.isLoading) {
          isLoadingDuringOperation = true
        }
        unsubscribe()
      })
      await whenListAssistanceRequests()
      expect(isLoadingDuringOperation).toBe(true)
    })
    it('should complete loading after operation', async () => {
      await whenListAssistanceRequests()
      expect(store.isLoading).toBe(false)
    })
  })

  const givenExistingRequests = (
    ...requests: Array<AssistanceRequestDetails>
  ) => {
    gateway.feedWith(...requests)
  }

  const whenListAssistanceRequests = async () => {
    await listAssistanceRequests(gateway)
  }
})
