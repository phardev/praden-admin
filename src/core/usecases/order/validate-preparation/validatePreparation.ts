import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { OrderGateway } from '@core/gateways/orderGateway'
import { useInvoiceStore } from '@store/invoiceStore'
import { usePreparationStore } from '@store/preparationStore'

export const validatePreparation = async (
  orderGateway: OrderGateway,
  invoiceGateway: InvoiceGateway
) => {
  const preparationStore = usePreparationStore()
  try {
    preparationStore.startLoading()
    const preparation = preparationStore.current
    if (!preparation) throw new NoPreparationSelectedError()
    const validated = await orderGateway.validatePreparation(preparation)
    preparationStore.remove(validated.uuid)
    const invoice = await invoiceGateway.create(validated)
    const invoiceStore = useInvoiceStore()
    invoiceStore.set(invoice)
  } finally {
    preparationStore.stopLoading()
  }
}
