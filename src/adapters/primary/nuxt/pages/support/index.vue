<template lang="pug">
.section(class="space-y-8")
  .mb-10
    .flex.items-center.gap-4.mb-3
      .w-1.h-8.bg-customPrimary-500.rounded-full
      h1.text-page-title.text-gray-900 {{ $t('support.title') }}

  div(v-if="supportTicketsVM.isLoading")
    .kanban-board(class="flex gap-6 overflow-x-auto pb-4")
      .each(v-for="i in 4" :key="i")
        .kanban-column(class="flex-shrink-0 w-80")
          UCard.h-96(class="shadow-soft rounded-xl border-0 bg-gray1")
            template(#header)
              USkeleton.h-6.w-32
            USkeleton.h-64.w-full

  div(v-else)
    .kanban-board(class="flex gap-6 overflow-x-auto pb-4")
      .each(v-for="column in supportTicketsVM.columns" :key="column.key")
        .kanban-column(class="flex-shrink-0 w-full max-w-sm min-h-[600px] xl:max-w-xs 2xl:max-w-sm")
          UCard.h-full(
            variant="outline"
            class="shadow-soft rounded-xl border-gray-100/60 bg-gray1 hover:shadow-warm transition-all duration-300"
          )
            template(#header)
              .flex.items-center.justify-between.p-3
                .flex.items-center.gap-3
                  .w-3.h-3.rounded-full(:class="getColumnIndicatorColor(column.key)")
                  h3.font-semibold.text-gray-800.tracking-wide {{ $t(`support.columns.${column.key}`) }}
                UBadge(
                  :label="column.count.toString()"
                  variant="soft"
                  :color="getColumnBadgeColor(column.key)"
                  class="px-3 py-1 rounded-full font-medium"
                )

          .kanban-content(class="flex-1 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto px-2 py-2")
            div(v-if="column.tickets.length === 0")
              .text-center.text-gray-400.py-8.px-4
                .mb-4
                  UIcon(name="i-lucide-inbox" class="w-12 h-12 mx-auto text-gray-200")
                p.text-sm.font-light.leading-relaxed {{ $t('support.tickets.noTickets') }}

            .each(v-for="ticket in column.tickets" :key="ticket.uuid")
              .ticket-card(
                class="bg-white/90 backdrop-blur-sm border border-gray-100/70 rounded-xl cursor-pointer shadow-whisper p-3 hover:shadow-gentle hover:border-gray-200/80 hover:-translate-y-0.5 transition-all duration-300 ease-out group"
                @click="navigateToTicket(ticket.uuid)"
              )
                .flex.items-start.justify-between.mb-4
                  .flex.items-center.gap-3
                    .text-sm.font-medium.text-gray-700.tracking-wide {{ ticket.ticketNumber }}
                  TicketPriorityBadge(:priority="ticket.priority" class="scale-95")

                h4(
                  class="font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-gray-800 transition-colors"
                ) {{ ticket.subject }}

                p(
                  class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed font-light"
                ) {{ ticket.firstMessageContent }}

                .flex.items-center.justify-between.text-sm.text-gray-500
                  .flex.items-center.gap-2.font-medium
                    .w-6.h-6.rounded-full(
                      class="bg-customPrimary-100 flex items-center justify-center"
                    )
                      UIcon(name="i-lucide-user" class="w-3 h-3 text-customPrimary-600")
                    span.text-customPrimary-700 {{ ticket.customerName }}
                  .flex.items-center.gap-2.text-xs.text-gray-400
                    UIcon(name="i-lucide-clock" class="w-3 h-3")
                    span {{ formatDate(ticket.createdAt) }}
</template>

<script lang="ts" setup>
import { getSupportTickets } from '@core/usecases/support/getSupportTickets'
import { useTicketGateway } from '../../../../../../gateways/ticketGateway'
import { getSupportTicketsVM } from '@adapters/primary/view-models/support/get-support-tickets/getSupportTicketsVM'

definePageMeta({ layout: 'main' })

const router = useRouter()
const ticketGateway = useTicketGateway()

const supportTicketsVM = computed(() => getSupportTicketsVM())

onMounted(async () => {
  try {
    await getSupportTickets(ticketGateway)
  } catch (error) {
    console.error('Error loading support tickets:', error)
  }
})

const navigateToTicket = (ticketUuid: string) => {
  router.push(`/support/${ticketUuid}`)
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getColumnIndicatorColor = (columnKey: string) => {
  const colors = {
    new: 'bg-customBlue-500',
    started: 'bg-customPrimary-500',
    waiting_for_answer: 'bg-orange-600',
    resolved: 'bg-grass7',
    closed: 'bg-gray-500'
  }
  return colors[columnKey as keyof typeof colors] || 'bg-gray-400'
}

const getColumnBadgeColor = (columnKey: string) => {
  const colors = {
    new: 'blue',
    started: 'primary',
    waiting_for_answer: 'orange',
    resolved: 'green',
    closed: 'gray'
  }
  return colors[columnKey as keyof typeof colors] || 'gray'
}
</script>

<style scoped>
@import url('~/assets/css/humanized-support.css');
</style>
