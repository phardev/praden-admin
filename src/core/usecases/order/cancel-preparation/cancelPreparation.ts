import { OrderGateway } from '@core/gateways/orderGateway'
import { usePreparationStore } from '@store/preparationStore'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { useInvoiceStore } from '@store/invoiceStore'

export const cancelPreparation = async (
  orderGateway: OrderGateway,
  invoiceGateway: InvoiceGateway
) => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  const canceled = await orderGateway.cancelPreparation(preparation)
  preparationStore.remove(canceled.uuid)
  const invoice = await invoiceGateway.create(canceled)
  const invoiceStore = useInvoiceStore()
  invoiceStore.set(invoice)
}
