<template lang="pug">
div
  PieChart(:data="data" :config="pieChartConfig" @segment-click="onCategoryClick" @center-click="onCenterClick")
</template>

<script setup lang="ts">
import PieChart from './PieChart.vue'

interface ProductByCategory {
  categoryUuid: string
  categoryName: string
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
  if (category && category.categoryUuid && props.data.length > 1) {
    emit('select-category', category.categoryUuid)
  }
}

const onCenterClick = () => {
  emit('navigate-to-parent')
}

const pieChartConfig = {
  idField: 'categoryUuid',
  nameField: 'categoryName',
  countField: 'count',
  topCount: 12,
  otherLabel: 'Autres',
  innerRadius: 0.5,
  tooltipLabel: 'Produits vendus',
  showBackButton: props.data.some((item) => item.parentUuid)
}
</script>
