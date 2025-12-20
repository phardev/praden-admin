<template lang="pug">
div
  PieChart(:data="data" :config="pieChartConfig" @segment-click="onCategoryClick" @center-click="onCenterClick")
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'

interface ProductByCategory {
  uuid: string
  name: string
  parentUuid?: string | null
  count: number
}

const props = defineProps<{
  data: ProductByCategory[]
}>()

const emit = defineEmits<{
  'select-category': [categoryUuid: string]
  'navigate-to-parent': []
}>()

const onCategoryClick = (category: ProductByCategory) => {
  if (category && props.data.length > 1) {
    emit('select-category', category.uuid)
  }
}

const onCenterClick = () => {
  emit('navigate-to-parent')
}

const pieChartConfig = {
  idField: 'uuid',
  nameField: 'name',
  countField: 'count',
  topCount: 12,
  otherLabel: 'Autres',
  innerRadius: 0.5,
  tooltipLabel: 'Produits vendus',
  showBackButton: props.data.some((item: ProductByCategory) => item.parentUuid)
}
</script>
