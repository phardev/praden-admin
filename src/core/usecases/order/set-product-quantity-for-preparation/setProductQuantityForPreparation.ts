import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'

export const setProductQuantityForPreparation = (
  cip13: string,
  quantity: number
) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  const line = preparation.lines.find((line: OrderLine) => line.cip13 === cip13)
  if (line) {
    line.preparedQuantity = quantity
  }
  preparationStore.setCurrent(preparation)
}
