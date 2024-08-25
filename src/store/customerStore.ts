import { defineStore } from 'pinia'

import { Customer } from '@core/entities/customer'
import { UUID } from '@core/types/types'

export const useCustomerStore = defineStore('CustomerStore', {
  state: () => {
    return {
      items: [] as Array<Customer>,
      current: undefined as Customer | undefined
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Customer => {
        const customer = state.items.find((c) => c.uuid === uuid)
        return customer
      }
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
