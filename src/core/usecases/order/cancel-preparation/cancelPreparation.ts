import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { useInvoiceStore } from '@store/invoiceStore'
import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'

export const cancelPreparation = async (
  orderGateway: OrderGateway,
  invoiceGateway: InvoiceGateway
) => {
  const preparationStore = usePreparationStore()
  preparationStore.startLoading()
  const preparation = preparationStore.current
  if (!preparation) throw new NoPreparationSelectedError()
  const canceled = await orderGateway.cancelPreparation(preparation)
  preparationStore.remove(canceled.uuid)
  const invoice = await invoiceGateway.create(canceled)
  const invoiceStore = useInvoiceStore()
  invoiceStore.set(invoice)
  preparationStore.stopLoading()
}
