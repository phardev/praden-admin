<template lang="pug">
UCard
  template(#header)
    .flex.items-center.justify-between
      h2.text-lg.font-semibold {{ $t('loyalty.customerPoints') }}
      icon(name="i-heroicons-gift" class="text-2xl text-primary")

  template(#default)
    .space-y-6
      .grid.grid-cols-2.gap-4
        .text-center.p-4.bg-primary-50.rounded-lg
          p.text-sm.text-gray-600 {{ $t('loyalty.currentBalance') }}
          p.text-2xl.font-bold.text-primary {{ vm.balanceFormatted }}
        .text-center.p-4.bg-gray-50.rounded-lg
          p.text-sm.text-gray-600 {{ $t('loyalty.totalEarned') }}
          p.text-2xl.font-bold.text-gray-700 {{ vm.totalEarnedFormatted }}

      div(v-if="vm.hasHistory")
        h3.text-md.font-semibold.mb-3 {{ $t('loyalty.history') }}
        .space-y-2
          .flex.items-center.justify-between.p-3.border.rounded-lg(
            v-for="transaction in vm.transactions"
            :key="transaction.uuid"
            :class="{ 'opacity-50': transaction.isExpired }"
          )
            .flex.items-center.gap-3
              .flex.flex-col
                span.text-sm.font-medium {{ transaction.pointsFormatted }}
                NuxtLink.text-xs.text-primary.hover_underline(:to="transaction.orderLink")
                  | {{ $t('loyalty.orderRef') }}
              UBadge.ml-2(
                v-if="transaction.isExpired"
                color="red"
                variant="subtle"
                size="xs"
              ) {{ $t('loyalty.expired') }}
            .text-right.text-xs.text-gray-500
              div {{ $t('loyalty.earnedOn') }} {{ transaction.earnedAt }}
              div(v-if="!transaction.isExpired") {{ $t('loyalty.expiresOn') }} {{ transaction.expiresAt }}

      .text-center.py-8(v-else)
        .space-y-2
          icon.text-muted(name="i-heroicons-gift" size="48")
          p.text-sm.text-muted {{ $t('loyalty.noHistory') }}
</template>

<script lang="ts" setup>
import type { CustomerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty/customerLoyaltyVM'

interface Props {
  vm: CustomerLoyaltyVM
}

defineProps<Props>()
</script>
