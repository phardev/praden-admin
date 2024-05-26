import { usePreparationStore } from '@store/preparationStore'
import { clearPreparationError } from './clearPreparationError'
import { createPinia, setActivePinia } from 'pinia'
import {
  PreparationError,
  PreparationErrorType
} from '@core/usecases/order/scan-product-to-preparation/scanProductToPreparation'

describe('Clear preparation error', () => {
  let preparationStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    preparationStore = usePreparationStore()
  })

  describe('There is no error', () => {
    it('should do nothing', () => {
      whenClearPreparationError()
      expectPreparationErrorToBeUndefined()
    })
  })
  describe('There is an error', () => {
    it('should clear the error', () => {
      const error: PreparationError = {
        type: PreparationErrorType.ProductNotInPreparationError,
        value: 'value'
      }
      givenThereIsAnError(error)
      whenClearPreparationError()
      expectPreparationErrorToBeUndefined()
    })
  })

  const givenThereIsAnError = (error: PreparationError) => {
    preparationStore.error = error
  }

  const whenClearPreparationError = () => {
    clearPreparationError()
  }

  const expectPreparationErrorToBeUndefined = () => {
    expect(preparationStore.error).toBeUndefined()
  }
})
