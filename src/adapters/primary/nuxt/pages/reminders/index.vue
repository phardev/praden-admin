#
<template lang="pug">
.reminders-container.p-4.mx-auto
  .flex.flex-col.justify-between.items-start.gap-4.mb-4(class="md:flex-row md:items-center")
    h2.text-xl.font-bold.text-primary-700 {{ $t('reminders.title') }}
    UButton(
      color="primary"
      icon="i-heroicons-arrow-path"
      :loading="isLoading"
      size="sm"
      @click="fetchRemindersData"
    )
      | {{ $t('reminders.refresh') }}

  .flex.justify-center.items-center.h-64(v-if="isLoading")
    icon.animate-spin.h-8.w-8(name="i-heroicons-arrow-path")

  .reminders-content(v-else)
    .grid.grid-cols-1.gap-4.mb-8(class="md:grid-cols-2")
      UCard
        template(#header)
          h3.text-lg.font-medium {{ $t('reminders.payment.title') }}
        template(#default)
          .p-4
            .grid.grid-cols-1.gap-4(class="md:grid-cols-2")
              .stat-card.p-4.rounded-lg.bg-gray-50
                .text-center
                  p.text-3xl.font-bold {{ reminders.paymentReminders.messagesSentCount }}
                  p.text-sm.text-gray-500 {{ $t('reminders.payment.messagesSent') }}
              .stat-card.p-4.rounded-lg.bg-gray-50
                .text-center
                  p.text-3xl.font-bold {{ reminders.paymentReminders.orderCreatedCount }}
                  p.text-sm.text-gray-500 {{ $t('reminders.payment.ordersCreated') }}
              .stat-card.p-4.rounded-lg.bg-gray-50.col-span-2(v-if="reminders.paymentReminders.orderCreatedCount > 0")
                .text-center
                  p.text-3xl.font-bold {{ reminders.paymentReminders.conversionRate }}%
                  p.text-sm.text-gray-500 {{ $t('reminders.payment.conversionRate') }}
</template>

<script lang="ts" setup>
import { useRemindersData } from '../../composables/useRemindersData'

definePageMeta({ layout: 'main' })

const { isLoading, reminders, fetchRemindersData } = useRemindersData()

onMounted(() => {
  fetchRemindersData()
})
</script>
