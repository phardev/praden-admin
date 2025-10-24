import { Invoice } from '@core/entities/invoice'
import { defineStore } from 'pinia'

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
