import { Order, OrderLine } from '@core/entities/order'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'

export const changeProductEan13ForPreparation = (
  oldEan13: string,
  newEan13: string
) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  const line = preparation.lines.find(
    (line: OrderLine) => line.ean13 === oldEan13
  )
  if (line) {
    line.ean13 = newEan13
  }
  preparationStore.setCurrent(preparation)
}
