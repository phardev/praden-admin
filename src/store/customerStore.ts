import { defineStore } from 'pinia'

import { Customer } from '@core/entities/customer'

export const useCustomerStore = defineStore('CustomerStore', {
  state: () => {
    return {
      items: [] as Array<Customer>,
      current: undefined as Customer | undefined
    }
  },
  actions: {
    list(customers: Array<Customer>) {
      this.items = customers
    },
    add(customer: Customer) {
      this.items.push(customer)
    },
    edit(customer: Customer) {
      this.items = this.items.map((c) => {
        return c.uuid === customer.uuid ? customer : c
      })
    },
    setCurrent(customer: Customer) {
      this.current = JSON.parse(JSON.stringify(customer))
    }
  }
})
