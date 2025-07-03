<template lang="pug">
div
  PieChart(:data="data" :config="pieChartConfig")
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'

interface OrderByDeliveryMethod {
  deliveryMethodUuid: string
  deliveryMethodName: string
  count: number
}

defineProps<{
  data: OrderByDeliveryMethod[]
}>()

const pieChartConfig = {
  idField: 'deliveryMethodUuid',
  nameField: 'deliveryMethodName',
  countField: 'count'
}
</script>
