<template lang="pug">
div(v-if="vm.hasHistory")
  UTable(:data="vm.history" :columns="columns")
    template(#date-cell="{ row }")
      span {{ row.original.formattedDate }}
    template(#type-cell="{ row }")
      UBadge(
        :color="getTypeColor(row.original.type)"
        variant="subtle"
      ) {{ $t(getTypeLabel(row.original.type)) }}
    template(#points-cell="{ row }")
      span(:class="row.original.isPositive ? 'text-success' : 'text-error'")
        | {{ row.original.isPositive ? '+' : '-' }}{{ row.original.points }} {{ $t('customers.pointsUnit') }}
    template(#order-cell="{ row }")
      NuxtLink.text-primary(
        v-if="row.original.orderUuid"
        :to="`/orders/${row.original.orderUuid}`"
        class="hover:underline"
      ) {{ $t('customers.viewOrder') }}
      span.text-muted(v-else) -
    template(#expires-cell="{ row }")
      span(v-if="row.original.formattedExpiresAt") {{ row.original.formattedExpiresAt }}
      span.text-muted(v-else) -

div.text-center.py-8(v-else)
  .space-y-2
    UIcon.text-muted(name="i-lucide-gift" size="48")
    p.text-sm.text-muted {{ $t('customers.noLoyaltyHistory') }}
</template>

<script lang="ts" setup>
import type { CustomerLoyaltyVM } from '@adapters/primary/view-models/customers/customer-loyalty/customerLoyaltyVM'
import { LoyaltyTransactionType } from '@core/entities/loyaltyTransaction'

interface Props {
  vm: CustomerLoyaltyVM
}

defineProps<Props>()

const { t } = useI18n()

const columns = [
  { key: 'date', label: t('customers.loyaltyDate') },
  { key: 'type', label: t('customers.loyaltyType') },
  { key: 'points', label: t('customers.loyaltyPointsColumn') },
  { key: 'order', label: t('customers.loyaltyOrder') },
  { key: 'expires', label: t('customers.loyaltyExpires') }
]

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    [LoyaltyTransactionType.Earned]: 'customers.loyaltyEarned',
    [LoyaltyTransactionType.Redeemed]: 'customers.loyaltyRedeemed',
    [LoyaltyTransactionType.Expired]: 'customers.loyaltyExpired',
    [LoyaltyTransactionType.Adjusted]: 'customers.loyaltyAdjusted'
  }
  return labels[type] ?? 'customers.loyaltyUnknown'
}

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    [LoyaltyTransactionType.Earned]: 'success',
    [LoyaltyTransactionType.Redeemed]: 'info',
    [LoyaltyTransactionType.Expired]: 'error',
    [LoyaltyTransactionType.Adjusted]: 'warning'
  }
  return colors[type] ?? 'neutral'
}
</script>
