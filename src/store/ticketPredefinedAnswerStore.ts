import { defineStore } from 'pinia'
import { UUID } from '@core/types/types'
import { TicketPredefinedAnswer } from '@core/entities/ticketPredefinedAnswer'

export const useTicketPredefinedAnswerStore = defineStore(
  'TicketPredefinedAnswerStore',
  {
    state: () => {
      return {
        items: [] as Array<TicketPredefinedAnswer>,
        isLoading: false
      }
    },
    getters: {
      getByUuid: (state) => {
        return (uuid: UUID): TicketPredefinedAnswer | undefined => {
          return state.items.find((answer) => answer.uuid === uuid)
        }
      }
    },
    actions: {
      list(answers: Array<any>) {
        this.items = JSON.parse(JSON.stringify(answers))
      },
      add(answer: any) {
        this.items.push(JSON.parse(JSON.stringify(answer)))
      },
      update(answer: any) {
        const index = this.items.findIndex((a) => a.uuid === answer.uuid)
        if (index >= 0) {
          this.items[index] = JSON.parse(JSON.stringify(answer))
        }
      },
      remove(uuid: UUID) {
        const index = this.items.findIndex((a) => a.uuid === uuid)
        if (index >= 0) {
          this.items.splice(index, 1)
        }
      },
      startLoading() {
        this.isLoading = true
      },
      stopLoading() {
        this.isLoading = false
      }
    }
  }
)
