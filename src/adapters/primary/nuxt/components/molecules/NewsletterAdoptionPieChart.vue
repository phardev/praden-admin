<template lang="pug">
div
  PieChart(:data="transformedData" :config="pieChartConfig" :custom-colors="adoptionColors")
</template>

<script setup lang="ts">
import type { NewsletterAdoption } from '@core/entities/dashboard'
import PieChart from './PieChart.vue'

const props = defineProps<{
  data: NewsletterAdoption
}>()

const { t } = useI18n()

const transformedData = computed(() => [
  {
    id: 'subscribers',
    name: t('dashboard.userStatistics.subscribers'),
    count: props.data?.subscribers || 0
  },
  {
    id: 'non-subscribers',
    name: t('dashboard.userStatistics.nonSubscribers'),
    count: props.data?.nonSubscribers || 0
  }
])

const pieChartConfig = {
  idField: 'id',
  nameField: 'name',
  countField: 'count',
  innerRadius: 0,
  tooltipLabel: t('dashboard.userStatistics.subscribers')
}

const adoptionColors = {
  subscribers: '#10B981',
  'non-subscribers': '#9CA3AF'
}
</script>
