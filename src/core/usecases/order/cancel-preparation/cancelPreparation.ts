import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { OrderGateway } from '@core/gateways/orderGateway'
import { useInvoiceStore } from '@store/invoiceStore'
import { usePreparationStore } from '@store/preparationStore'

export const cancelPreparation = async (
  orderGateway: OrderGateway,
  invoiceGateway: InvoiceGateway
) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const preparation = preparationStore.current
    if (!preparation) throw new NoPreparationSelectedError()
    const canceled = await orderGateway.cancelPreparation(preparation)
    preparationStore.remove(canceled.uuid)
    const invoice = await invoiceGateway.create(canceled)
    const invoiceStore = useInvoiceStore()
    invoiceStore.set(invoice)
  } finally {
    preparationStore.stopLoading()
  }
}
