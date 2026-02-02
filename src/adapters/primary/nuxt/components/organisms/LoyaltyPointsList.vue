<template lang="pug">
div(v-if="!vm.isLoading")
  .mb-6.flex.items-center.gap-6(v-if="vm.balance > 0 || vm.items.length > 0")
    .flex.items-center.gap-2
      .text-2xl.font-bold.text-primary {{ vm.balance }}
      span.text-muted {{ $t('customers.loyaltyBalance') }}
    .flex.items-center.gap-2.text-warning(v-if="vm.expiringPoints > 0")
      UIcon(name="i-lucide-clock" size="16")
      span.text-sm {{ vm.expiringPoints }} {{ $t('customers.loyaltyExpiringPoints') }}
      span.text-sm.text-muted(v-if="vm.expiringDate") ({{ formatDate(vm.expiringDate) }})

  .space-y-3(v-if="vm.items.length > 0")
    UCard(
      v-for="item in vm.items"
      :key="item.uuid"
    )
      .flex.items-center.justify-between
        .flex.items-center.gap-3
          .flex.items-center.justify-center.w-10.h-10.rounded-full(:class="getPointsBackgroundClass(item.points)")
            span.font-bold(:class="getPointsTextClass(item.points)") {{ formatPoints(item.points) }}
          .space-y-1
            .font-medium.text-sm {{ $t(`customers.loyaltyTransactionTypes.${item.type}`) }}
            p.text-xs.text-muted(v-if="item.reason") {{ item.reason }}
            p.text-xs.text-muted(v-if="item.orderUuid") {{ $t('customers.loyaltyOrderRef') }}: {{ item.orderUuid }}
        time.text-xs.text-muted {{ formatDate(item.createdAt) }}

  .text-center.py-8(v-else)
    .space-y-2
      UIcon.text-muted(name="i-lucide-coins" size="48")
      p.text-sm.text-muted {{ $t('customers.loyaltyNoTransactions') }}

div.space-y-4(v-else)
  USkeleton.h-12
  USkeleton.h-24(v-for="i in 3" :key="i")
</template>

<script lang="ts" setup>
import { getLoyaltyTransactionsVM } from '@adapters/primary/view-models/customers/get-loyalty-transactions/getLoyaltyTransactionsVM'
import { timestampToLocaleString } from '@utils/formatters'

const vm = computed(() => getLoyaltyTransactionsVM())

const formatDate = (timestamp: number) => {
  return timestampToLocaleString(timestamp, 'fr-FR')
}

const formatPoints = (points: number) => {
  return points > 0 ? `+${points}` : points.toString()
}

const getPointsBackgroundClass = (points: number) => {
  return points >= 0 ? 'bg-green-100' : 'bg-red-100'
}

const getPointsTextClass = (points: number) => {
  return points >= 0 ? 'text-green-700' : 'text-red-700'
}
</script>
