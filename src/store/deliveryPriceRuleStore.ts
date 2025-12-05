import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'
import type { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useDeliveryPriceRuleStore = defineStore('DeliveryPriceRuleStore', {
  state: () => {
    return {
      items: [] as Array<DeliveryPriceRule>,
      current: null as DeliveryPriceRule | null,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): DeliveryPriceRule | undefined => {
        return state.items.find((rule) => rule.uuid === uuid)
      }
    },
    getByDeliveryMethodUuid: (state) => {
      return (deliveryMethodUuid: UUID): Array<DeliveryPriceRule> => {
        return state.items.filter(
          (rule) => rule.deliveryMethodUuid === deliveryMethodUuid
        )
      }
    }
  },
  actions: {
    list(rules: Array<DeliveryPriceRule>) {
      this.items = rules
    },
    add(rule: DeliveryPriceRule) {
      this.items.push(rule)
    },
    edit(updatedRule: DeliveryPriceRule) {
      const index = this.items.findIndex((r) => r.uuid === updatedRule.uuid)
      if (index !== -1) {
        this.items[index] = updatedRule
      }
    },
    remove(uuid: UUID) {
      this.items = this.items.filter((r) => r.uuid !== uuid)
    },
    setCurrent(rule: DeliveryPriceRule | null) {
      this.current = rule
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
