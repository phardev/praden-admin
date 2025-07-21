<template lang="pug">
.section
  .mb-8
    h1.text-page-title {{ $t('support.title') }}

  div(v-if="supportTicketsVM.isLoading")
    .grid(class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6")
      .each(v-for="i in 4" :key="i")
        UCard.h-96
          template(#header)
            USkeleton.h-6.w-32
          USkeleton.h-64.w-full

  div(v-else)
    .grid(class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6")
      .each(v-for="(column, columnKey) in supportTicketsVM.columns" :key="columnKey")
        UCard.h-fit(variant="outline")
          template(#header)
            .flex.items-center.justify-between
              h3.font-semibold.text-gray-900 {{ $t(`support.columns.${columnKey}`) }}
              UBadge(
                :label="column.count.toString()"
                variant="subtle"
                color="gray"
              )

          .space-y-3(class="max-h-[calc(100vh-16rem)] overflow-y-auto")
            div(v-if="column.tickets.length === 0")
              .text-center.text-gray-500.py-12
                UIcon(name="i-lucide-inbox" class="w-12 h-12 mx-auto mb-4 text-gray-300")
                p {{ $t('support.tickets.noTickets') }}

            .each(v-for="ticket in column.tickets" :key="ticket.uuid")
              .bg-white.border.border-gray-200.rounded-lg.cursor-pointer.shadow-sm(
                class="p-3 md:p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                @click="navigateToTicket(ticket.uuid)"
              )
                .flex.items-start.justify-between.mb-3
                  .text-sm.font-medium.text-gray-900 {{ ticket.ticketNumber }}
                  TicketPriorityBadge(:priority="ticket.priority")

                h4.font-medium.text-gray-900.mb-2.line-clamp-2 {{ ticket.subject }}

                p.text-sm.text-gray-600.mb-3.line-clamp-2 {{ ticket.firstMessageContent }}

                .flex.items-center.justify-between.text-sm.text-gray-500
                  .flex.items-center.gap-2
                    UIcon(name="i-lucide-user" class="w-4 h-4")
                    span {{ ticket.customerName }}
                  .flex.items-center.gap-2
                    UIcon(name="i-lucide-clock" class="w-4 h-4")
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
</script>
