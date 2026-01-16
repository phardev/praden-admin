<template lang="pug">
div
  UCard
    template(#header)
      .flex.items-center.justify-between
        h3.font-semibold {{ $t('customers.loyalty.title') }}
        .flex.items-center.gap-2
          UBadge(color="green" variant="soft")
            | {{ vm.activePoints }} {{ $t('customers.loyalty.activePoints') }}
          UBadge(v-if="vm.expiredPoints > 0" color="red" variant="soft")
            | {{ vm.expiredPoints }} {{ $t('customers.loyalty.expiredPoints') }}

    div(v-if="vm.isLoading")
      .flex.justify-center.py-4
        UIcon.animate-spin.text-2xl(name="i-heroicons-arrow-path")

    div(v-else-if="!vm.hasTransactions")
      .text-center.py-8
        .space-y-2
          UIcon.text-muted(name="i-heroicons-gift" size="48")
          p.text-sm.text-muted {{ $t('customers.loyalty.noTransactions') }}

    div(v-else)
      .mb-4
        .text-center
          .text-3xl.font-bold.text-primary {{ vm.totalPoints }}
          .text-sm.text-muted {{ $t('customers.loyalty.totalPoints') }}

      UTable(
        :rows="vm.transactions"
        :columns="columns"
      )
        template(#order-data="{ row }")
          NuxtLink(
            :to="`/orders/${row.orderUuid}`"
            class="text-primary hover:underline"
          )
            | {{ row.orderUuid.substring(0, 8) }}...

        template(#points-data="{ row }")
          .flex.items-center.gap-2
            span.font-medium(:class="row.isExpired ? 'text-red-500 line-through' : 'text-green-600'")
              | +{{ row.points }}

        template(#eligibleAmount-data="{ row }")
          span {{ row.eligibleAmountFormatted }}

        template(#earnedAt-data="{ row }")
          span {{ row.earnedAtFormatted }}

        template(#expiresAt-data="{ row }")
          span(:class="row.isExpired ? 'text-red-500' : ''")
            | {{ row.expiresAtFormatted }}
            UBadge.ml-2(v-if="row.isExpired" color="red" variant="soft" size="xs")
              | {{ $t('customers.loyalty.expired') }}
</template>

<script lang="ts" setup>
import { getCustomerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty/customerLoyaltyVM'
import { useDateProvider } from '../../../../../../gateways/dateProvider'

const { t } = useI18n()
const dateProvider = useDateProvider()

const vm = computed(() => getCustomerLoyaltyVM(dateProvider))

const columns = computed(() => [
  { key: 'order', label: t('customers.loyalty.order') },
  { key: 'points', label: t('customers.loyalty.points') },
  { key: 'eligibleAmount', label: t('customers.loyalty.eligibleAmount') },
  { key: 'earnedAt', label: t('customers.loyalty.earnedAt') },
  { key: 'expiresAt', label: t('customers.loyalty.expiresAt') }
])
</script>
