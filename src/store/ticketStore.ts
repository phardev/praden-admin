import { defineStore } from 'pinia'
import { Ticket } from '@core/entities/ticket'
import { UUID } from '@core/types/types'

export const useTicketStore = defineStore('TicketStore', {
  state: () => {
    return {
      items: [] as Array<Ticket>,
      currentTicket: undefined as Ticket | undefined,
      customerTickets: {} as Record<UUID, Array<Ticket>>,
      orderTickets: {} as Record<UUID, Array<Ticket>>,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Ticket | undefined => {
        return state.items.find((t) => t.uuid === uuid)
      }
    },
    getCustomerTickets: (state) => {
      return (customerUuid: UUID): Array<Ticket> => {
        return state.customerTickets[customerUuid] || []
      }
    },
    getOrderTickets: (state) => {
      return (orderUuid: UUID): Array<Ticket> => {
        return state.orderTickets[orderUuid] || []
      }
    }
  },
  actions: {
    setTickets(tickets: Array<Ticket>) {
      this.items = tickets
    },
    setCustomerTickets(customerUuid: UUID, tickets: Array<Ticket>) {
      this.customerTickets[customerUuid] = tickets
    },
    setOrderTickets(orderUuid: UUID, tickets: Array<Ticket>) {
      this.orderTickets[orderUuid] = tickets
    },
    updateTicket(ticket: Ticket) {
      const index = this.items.findIndex((t) => t.uuid === ticket.uuid)
      if (index >= 0) {
        this.items[index] = ticket
      } else {
        this.items.push(JSON.parse(JSON.stringify(ticket)))
      }

      if (this.currentTicket?.uuid === ticket.uuid) {
        this.currentTicket = JSON.parse(JSON.stringify(ticket))
      }
    },
    setCurrentTicket(ticket: Ticket) {
      this.currentTicket = JSON.parse(JSON.stringify(ticket))
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
