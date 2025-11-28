<template lang="pug">
.promotion-stats-table
  div(v-if="!statsVm" class="text-center py-8 text-contrast")
    p {{ $t('promotion.stats.noData') }}
  div(v-else)
    ft-table(
      :headers="headers"
      :items="statsVm.productUsages"
      :is-loading="false"
    )
</template>

<script lang="ts" setup>
import type { PromotionStatsVM } from '@adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM'

const props = defineProps<{
  statsVm: PromotionStatsVM | null
}>()

const { t } = useI18n()

const headers = computed(() => [
  {
    name: t('promotion.stats.productName'),
    value: 'name'
  },
  {
    name: t('promotion.stats.reference'),
    value: 'ean13'
  },
  {
    name: t('promotion.stats.usageCount'),
    value: 'usageCount'
  },
  {
    name: t('promotion.stats.totalAmountTaxIncluded'),
    value: 'totalAmountTaxIncluded'
  },
  {
    name: t('promotion.stats.totalReductionTaxIncluded'),
    value: 'totalReductionTaxIncluded'
  }
])
</script>
