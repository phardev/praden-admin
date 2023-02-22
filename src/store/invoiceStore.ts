import { defineStore } from 'pinia'
import { Invoice } from '@core/entities/invoice'

export const useInvoiceStore = defineStore('InvoiceStore', {
  state: () => {
    return {
      current: undefined as Invoice | undefined
    }
  },
  actions: {
    set(invoice: Invoice) {
      this.current = invoice
    }
  }
})
