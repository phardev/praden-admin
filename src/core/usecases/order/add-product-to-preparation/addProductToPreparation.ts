import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'

export const addProductToPreparation = (cip13: string) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  const line = preparation.lines.find((line: OrderLine) => line.cip13 === cip13)
  if (line) {
    if (line.preparedQuantity < line.expectedQuantity) line.preparedQuantity++
  }
  preparationStore.setCurrent(preparation)
}
