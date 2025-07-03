<template lang="pug">
div
  PieChart(:data="transformedData" :config="pieChartConfig" :custom-colors="stockColors")
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'

interface ProductStockStats {
  inStockCount: number
  outOfStockCount: number
}

const props = defineProps<{
  data: ProductStockStats
}>()

const transformedData = [
  {
    id: 'in-stock',
    name: 'En stock',
    count: props.data?.inStockCount || 0
  },
  {
    id: 'out-of-stock',
    name: 'Rupture de stock',
    count: props.data?.outOfStockCount || 0
  }
]

const pieChartConfig = {
  idField: 'id',
  nameField: 'name',
  countField: 'count',
  innerRadius: 0,
  tooltipLabel: 'Nombre de produits'
}

const stockColors = {
  'in-stock': '#34D399',
  'out-of-stock': '#EF4444'
}
</script>
