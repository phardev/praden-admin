<template lang="pug">
div.space-y-4(v-if="!vm.isLoading && vm.tickets.length > 0")
  UCard(
    v-for="ticket in vm.tickets"
    :key="ticket.uuid"
    :class="'cursor-pointer hover:ring-1 hover:ring-default transition-all'"
    @click="clicked(ticket)"
  )
    template(#header)
      .flex.items-center.justify-between
        .flex.items-center.space-x-3
          ticket-priority-badge(:priority="ticket.priority" size="sm")
          h3.font-medium.text-sm.text-default {{ ticket.ticketNumber }}
        .flex.items-center.space-x-2
          ft-ticket-status-badge(:status="ticket.status" size="sm")
    .space-y-3
      h4.font-medium.text-default {{ ticket.subject }}
      p.text-sm.text-muted.line-clamp-2 {{ ticket.firstMessageContent }}
    template(#footer)
      .flex.items-center.justify-between.text-xs.text-muted
        time {{ formatDate(ticket.createdAt) }}
        span(v-if="ticket.updatedAt !== ticket.createdAt") {{ $t('common.updated') }} {{ formatDate(ticket.updatedAt) }}

div.text-center.py-8(v-else-if="!vm.isLoading && vm.tickets.length === 0")
  .space-y-2
    UIcon.text-muted(name="i-lucide-ticket" size="48")
    p.text-sm.text-muted {{ $t('support.noTicketsForCustomer') }}

div.space-y-4(v-else)
  USkeleton.h-32(v-for="i in 3" :key="i")
</template>

<script lang="ts" setup>
import { getCustomerTicketsVM } from '@adapters/primary/view-models/customers/get-customer-tickets/getCustomerTicketsVM'
import { timestampToLocaleString } from '@utils/formatters'

interface Props {
  customerUuid: string
}

const props = defineProps<Props>()

const vm = computed(() => getCustomerTicketsVM(props.customerUuid))

const clicked = (ticket: any) => {
  navigateTo(`/support/${ticket.uuid}`)
}

const formatDate = (timestamp: number) => {
  return timestampToLocaleString(timestamp, 'fr-FR')
}
</script>
