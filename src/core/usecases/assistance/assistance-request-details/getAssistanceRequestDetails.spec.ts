import { InMemoryAssistanceRequestGateway } from '@adapters/secondary/assistance-request-gateways/InMemoryAssistanceRequestGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { AssistanceRequestDetails } from '@core/entities/assistanceRequest'
import { AssistanceRequestDoesNotExistsError } from '@core/errors/AssistanceRequestDoesNotExistsError'
import { getAssistanceRequestDetails } from '@core/usecases/assistance/assistance-request-details/getAssistanceRequestDetails'
import { useAssistanceRequestStore } from '@store/assistanceRequestStore'
import { waitingForAnswerPriceRequest } from '@utils/testData/assistanceRequests'
import { createPinia, setActivePinia } from 'pinia'

describe('Get assistance request details', () => {
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

  describe('Given the request exists', () => {
    beforeEach(() => {
      givenExistingRequests(waitingForAnswerPriceRequest)
    })

    it('should set the details as current', async () => {
      await whenGetAssistanceRequestDetails(waitingForAnswerPriceRequest.id)
      expect(store.current).toStrictEqual(waitingForAnswerPriceRequest)
    })

    it('should be aware during loading', async () => {
      let isLoadingDuringOperation = false
      const unsubscribe = store.$subscribe((_mutation, state) => {
        if (state.isLoadingCurrent) {
          isLoadingDuringOperation = true
        }
        unsubscribe()
      })
      await whenGetAssistanceRequestDetails(waitingForAnswerPriceRequest.id)
      expect(isLoadingDuringOperation).toBe(true)
    })

    it('should be aware that loading is over', async () => {
      await whenGetAssistanceRequestDetails(waitingForAnswerPriceRequest.id)
      expect(store.isLoadingCurrent).toBe(false)
    })
  })

  describe('Given the request does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        whenGetAssistanceRequestDetails('non-existent-id')
      ).rejects.toThrow(AssistanceRequestDoesNotExistsError)
    })
  })

  const givenExistingRequests = (
    ...requests: Array<AssistanceRequestDetails>
  ) => {
    gateway.feedWith(...requests)
  }

  const whenGetAssistanceRequestDetails = async (id: string) => {
    await getAssistanceRequestDetails(id, gateway)
  }
})
