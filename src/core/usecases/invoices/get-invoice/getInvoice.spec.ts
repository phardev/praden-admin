import { createPinia, setActivePinia } from 'pinia'
import { useInvoiceStore } from '@store/invoiceStore'
import { InMemoryInvoiceGateway } from '@adapters/secondary/invoice-gateways/InMemoryInvoiceGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { Invoice } from '@core/entities/invoice'
import { orderDelivered2 } from '@utils/testData/orders'
import { getInvoice } from './getInvoice'

describe('Get invoice', () => {
  let invoiceStore: any
  let invoiceGateway: InMemoryInvoiceGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    invoiceStore = useInvoiceStore()
    invoiceGateway = new InMemoryInvoiceGateway(new FakeDateProvider())
  })

  describe('The invoice exists', () => {
    it('should save it in the store', async () => {
      const invoice: Invoice = {
        id: 'invoice',
        data: orderDelivered2,
        createdAt: 123456798
      }
      givenExistingInvoices(invoice)
      await whenGetInvoice(invoice.id)
      expect(invoiceStore.current).toStrictEqual(invoice)
    })
  })

  const givenExistingInvoices = (...invoices: Array<Invoice>) => {
    invoiceGateway.feedWith(...invoices)
  }

  const whenGetInvoice = async (invoiceNumber: string) => {
    await getInvoice(invoiceNumber, invoiceGateway)
  }
})
