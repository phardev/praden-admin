import { Laboratory } from '@core/entities/laboratory'
import { defineStore } from 'pinia'
import { Product } from '@core/entities/product'

export interface LaboratoryWithProducts {
  laboratory: Laboratory
  products: Array<Product>
}

export const useLaboratoryStore = defineStore('LaboratoryStore', {
  state: () => {
    return {
      items: [] as Array<Laboratory>,
      current: undefined as LaboratoryWithProducts | undefined
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: string): Laboratory | undefined => {
        return state.items.find((c) => c.uuid === uuid)
      }
    }
  },
  actions: {
    list(laboratories: Array<Laboratory>) {
      this.items = laboratories
    },
    add(laboratory: Laboratory) {
      this.items.push(laboratory)
    },
    edit(laboratory: Laboratory) {
      this.items = this.items.map((c) => {
        return c.uuid === laboratory.uuid ? laboratory : c
      })
    },
    setCurrent(laboratory: LaboratoryWithProducts) {
      this.current = JSON.parse(JSON.stringify(laboratory))
    }
  }
})
