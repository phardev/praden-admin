import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'

export const removeProductFromPreparation = (ean13: string) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  const line = preparation.lines.find((line: OrderLine) => line.ean13 === ean13)
  if (line && line.preparedQuantity > 0) {
    line.preparedQuantity--
  }
  preparationStore.setCurrent(preparation)
}
