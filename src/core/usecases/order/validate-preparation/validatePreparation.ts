import { NoPreparationSelectedError } from '@core/errors/noPreparationSelectedError'
import { usePreparationStore } from '@store/preparationStore'
import { OrderGateway } from '@core/gateways/orderGateway'
import { InvoiceGateway } from '@core/gateways/invoiceGateway'
import { useInvoiceStore } from '@store/invoiceStore'

export const validatePreparation = async (
  orderGateway: OrderGateway,
  invoiceGateway: InvoiceGateway
) => {
  const preparationStore = usePreparationStore()
  const preparation = preparationStore.current
  if (!preparation) throw new NoPreparationSelectedError()
  await orderGateway.validatePreparation(preparation)
  const invoice = await invoiceGateway.create(preparation)
  const invoiceStore = useInvoiceStore()
  invoiceStore.set(invoice)
}
