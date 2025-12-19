<template lang="pug">
div(v-if="chartData.length > 0")
  PieChart(:data="chartData" :config="pieChartConfig" :customColors="chartColors")
</template>

<script setup lang="ts">
import type { PromotionStatsVM } from '@adapters/primary/view-models/promotions/promotion-stats/promotionStatsVM'

const props = defineProps<{
  statsVm: PromotionStatsVM | null
}>()

const { t } = useI18n()

const chartData = computed(() => {
  if (!props.statsVm) return []

  return [
    {
      id: 'sales',
      name: t('promotion.stats.netSales'),
      count: props.statsVm.totalSalesRaw - props.statsVm.totalDiscountGivenRaw
    },
    {
      id: 'discount',
      name: t('promotion.stats.discount'),
      count: props.statsVm.totalDiscountGivenRaw
    }
  ]
})

const pieChartConfig = computed(() => ({
  idField: 'id',
  nameField: 'name',
  countField: 'count',
  innerRadius: 0.5,
  tooltipLabel: t('promotion.stats.tooltipLabel')
}))

const chartColors = {
  sales: '#0F9D58',
  discount: '#DB4437'
}
</script>
