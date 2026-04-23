<template lang="pug">
div
  PieChart(:data="chartData" :config="pieChartConfig")
</template>

<script setup lang="ts">
import type { RevenueByTaxRateVM } from '@adapters/primary/view-models/dashboard/get-dashboard/getDashboardVM'
import PieChart from './PieChart.vue'

const props = defineProps<{
  data: RevenueByTaxRateVM[]
}>()

const { t } = useI18n()

const chartData = computed(() =>
  props.data.map((entry: RevenueByTaxRateVM) => {
    const labelKey =
      entry.kind === 'DELIVERY'
        ? 'dashboard.turnoverByTaxRate.deliveryLabel'
        : 'dashboard.turnoverByTaxRate.productLabel'
    return {
      id: `${entry.kind.toLowerCase()}-${entry.percentTaxRate}`,
      label: t(labelKey, { rate: entry.percentTaxRate }),
      revenueTTC: Math.round(entry.revenueTTC * 100) / 100
    }
  })
)

const pieChartConfig = {
  idField: 'id',
  nameField: 'label',
  countField: 'revenueTTC',
  innerRadius: 0.5,
  tooltipLabel: t('dashboard.turnoverByTaxRate.tooltip')
}
</script>
