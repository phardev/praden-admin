import type { Cart, CustomerCartAction } from '@core/entities/cart'
import { Customer } from '@core/entities/customer'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('CustomerStore', {
  state: () => {
    return {
      items: [] as Array<Customer>,
      current: undefined as Customer | undefined,
      hasMore: false as boolean,
      pendingCartAction: undefined as CustomerCartAction | undefined
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Customer => {
        const customer = state.items.find((c) => c.uuid === uuid)
        return customer!
      }
    }
  },
  actions: {
    list(customers: Array<Customer>) {
      customers.forEach((c) => {
        const existingCustomer = this.items.find((item) => item.uuid === c.uuid)
        if (existingCustomer) {
          this.edit(c)
        } else {
          this.items.push(c)
        }
      })
      this.hasMore = customers.length > 0
    },
    add(customer: Customer) {
      const existingCustomer = this.items.find(
        (item) => item.uuid === customer.uuid
      )
      if (existingCustomer) {
        this.edit(customer)
      } else {
        this.items.push(customer)
      }
    },
    edit(customer: Customer) {
      this.items = this.items.map((c) => {
        return c.uuid === customer.uuid ? customer : c
      })
    },
    setCurrent(customer: Customer) {
      this.current = JSON.parse(JSON.stringify(customer))
    },
    startCartAction(action: CustomerCartAction) {
      this.pendingCartAction = action
    },
    stopCartAction() {
      this.pendingCartAction = undefined
    },
    setCurrentCart(cart: Cart) {
      if (!this.current) {
        return
      }
      this.current = { ...this.current, currentCart: cart }
    },
    remove(uuid: UUID) {
      this.items = this.items.filter((c) => c.uuid !== uuid)
      if (this.current?.uuid === uuid) {
        this.current = undefined
      }
    }
  }
})
