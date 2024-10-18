import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { Order, OrderLine } from '@core/entities/order'

export const changeProductEan13ForPreparation = (
  oldEan13: string,
  newEan13: string
) => {
  const preparationStore = usePreparationStore()
  if (!preparationStore.current) throw new NoPreparationSelectedError()
  const preparation: Order = JSON.parse(
    JSON.stringify(preparationStore.current)
  )
  console.log('oldean13: ', oldEan13)
  const line = preparation.lines.find(
    (line: OrderLine) => line.ean13 === oldEan13
  )
  console.log('preparation.lines: ', preparation.lines)
  console.log('line: ', line)
  console.log('newEan13: ', newEan13)
  if (line) {
    line.ean13 = newEan13
  }
  preparationStore.setCurrent(preparation)
}
