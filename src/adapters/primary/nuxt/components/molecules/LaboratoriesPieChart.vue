<template lang="pug">
div
  .text-lg.font-semibold.mb-2 Produits vendus par laboratoire
  PieChart(:data="data" :config="pieChartConfig")
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'

interface OrderByLaboratory {
  laboratoryUuid: string
  laboratoryName: string
  count: number
}

defineProps<{
  data: OrderByLaboratory[]
}>()

const pieChartConfig = {
  idField: 'laboratoryUuid',
  nameField: 'laboratoryName',
  countField: 'count',
  topCount: 12,
  otherLabel: 'Autres',
  innerRadius: 0.5,
  tooltipLabel: 'Produits vendus'
}
</script>
