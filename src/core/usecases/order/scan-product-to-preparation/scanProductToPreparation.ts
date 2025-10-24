import { Order, OrderLine } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'

export enum PreparationErrorType {
  ProductNotInPreparationError = 'ProductNotInPreparationError'
}

export interface PreparationError {
  type: PreparationErrorType
  value: string
}

export const scanProductToPreparation = (ean13: string) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  const line = preparation.lines.find((line: OrderLine) => line.ean13 === ean13)
  if (line) {
    line.preparedQuantity++
    preparationStore.setCurrent(preparation)
  } else {
    const error: PreparationError = {
      type: PreparationErrorType.ProductNotInPreparationError,
      value: ean13
    }
    preparationStore.setError(error)
  }
}
