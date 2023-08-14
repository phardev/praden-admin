import { NoPreparationSelectedError } from '@core/errors/NoPreparationSelectedError'
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
  const validated = await orderGateway.validatePreparation(preparation)
  preparationStore.remove(validated.uuid)
  const invoice = await invoiceGateway.create(validated)
  const invoiceStore = useInvoiceStore()
  invoiceStore.set(invoice)
}
