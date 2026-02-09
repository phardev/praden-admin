<template lang="pug">
div
  div(v-if="vm.transactions.length === 0")
    p.text-gray-500.text-center.py-4 {{ $t('loyalty.points.noHistory') }}
  UTable(
    v-else
    :rows="vm.transactions"
    :columns="columns"
  )
    template(#type-data="{ row }")
      span {{ transactionTypeLabel(row.type) }}
    template(#points-data="{ row }")
      span(:class="row.points > 0 ? 'text-green-600' : 'text-red-600'") +{{ row.points }}
    template(#orderOrReason-data="{ row }")
      NuxtLink(
        v-if="row.orderUuid"
        :to="`/orders/${row.orderUuid}`"
        class="text-primary-500 underline"
      ) {{ row.orderUuid }}
      span(v-else-if="row.reason") {{ row.reason }}
      span(v-else) -
    template(#expiresAt-data="{ row }")
      span(:class="{ 'text-gray-400': row.isExpired }") {{ row.expiresAt }}
</template>

<script lang="ts" setup>
import type { CustomerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty-vm/customerLoyaltyVM'
import { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'

const { t } = useI18n()

defineProps<{
  vm: CustomerLoyaltyVM
}>()

const columns = [
  { key: 'date', label: t('loyalty.points.date') },
  { key: 'type', label: t('loyalty.points.type') },
  { key: 'points', label: t('loyalty.points.pointsLabel') },
  { key: 'orderOrReason', label: t('loyalty.points.reason') },
  { key: 'expiresAt', label: t('loyalty.points.expiresAt') }
]

const transactionTypeLabel = (type: string) => {
  if (type === LoyaltyTransactionType.Earned) return t('loyalty.points.earned')
  return t('loyalty.points.manualCredit')
}
</script>
