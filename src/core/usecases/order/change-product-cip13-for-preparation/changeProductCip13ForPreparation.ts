import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'

export const changeProductCip13ForPreparation = (
  oldCip13: string,
  newCip13: string
) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  const line = preparation.lines.find(
    (line: OrderLine) => line.ean13 === oldCip13
  )
  if (line) {
    line.ean13 = newCip13
  }
  preparationStore.setCurrent(preparation)
}
