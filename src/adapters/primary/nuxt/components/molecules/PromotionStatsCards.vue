<template lang="pug">
.grid.grid-cols-3.gap-4(v-if="statsVm")
  .bg-light.rounded-lg.p-4
    p.text-sm.text-contrast.font-medium {{ $t('promotion.stats.totalUsage') }}
    p.text-2xl.font-bold.text-default {{ statsVm.usageCount }}
  .bg-light.rounded-lg.p-4
    p.text-sm.text-contrast.font-medium {{ $t('promotion.stats.totalSales') }}
    p.text-2xl.font-bold.text-default {{ statsVm.totalSales }}
  .bg-light.rounded-lg.p-4
    p.text-sm.text-contrast.font-medium {{ $t('promotion.stats.totalDiscount') }}
    p.text-2xl.font-bold.text-default {{ statsVm.totalDiscountGiven }}
</template>

<script setup lang="ts">
import type { PromotionStatsVM } from '@adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM'

const props = defineProps<{
  statsVm: PromotionStatsVM | null
}>()

const { t } = useI18n()
</script>
