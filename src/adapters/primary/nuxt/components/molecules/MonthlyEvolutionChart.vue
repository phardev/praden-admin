<template lang="pug">
.evolution-container
  .overflow-x-auto
    table.w-full.text-sm
      thead
        tr.border-b.border-gray-200
          th.py-2.px-3.text-left.text-gray-600.font-medium.w-16
          th.py-2.px-3.text-center.text-gray-600.font-medium(
            v-for="header in headers"
            :key="header"
          ) {{ header }}
      tbody
        tr.border-b.border-gray-100
          td.py-3.px-3.text-left.text-gray-600.font-medium {{ $t('dashboard.evolution.salesLabel') }}
          td.py-3.px-3.text-center(
            v-for="(evolution, index) in salesEvolutions"
            :key="'sales-' + index"
            :class="getEvolutionClass(evolution)"
          ) {{ formatEvolution(evolution) }}
        tr
          td.py-3.px-3.text-left.text-gray-600.font-medium {{ $t('dashboard.evolution.turnoverLabel') }}
          td.py-3.px-3.text-center(
            v-for="(evolution, index) in turnoverEvolutions"
            :key="'turnover-' + index"
            :class="getEvolutionClass(evolution)"
          ) {{ formatEvolution(evolution) }}
</template>

<script lang="ts" setup>
import type { MonthlySalesVM } from '../../../view-models/dashboard/get-dashboard/getDashboardVM'

interface Props {
  currentYearData: MonthlySalesVM[]
  previousYearData: MonthlySalesVM[]
}

const props = defineProps<Props>()
const { t } = useI18n()

const MONTHS = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12'
]

const MONTH_LABELS = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc'
]

const headers = computed(() => [...MONTH_LABELS, 'Total'])

const extractMonth = (monthString: string): string => {
  return monthString.split('-')[1]
}

const createMonthMap = (
  data: MonthlySalesVM[]
): Map<string, MonthlySalesVM> => {
  const map = new Map<string, MonthlySalesVM>()
  data.forEach((item) => {
    const month = extractMonth(item.month)
    map.set(month, item)
  })
  return map
}

const calculateEvolution = (
  current: number,
  previous: number
): number | null => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / previous) * 100
}

const salesEvolutions = computed(() => {
  const currentMap = createMonthMap(props.currentYearData)
  const previousMap = createMonthMap(props.previousYearData)

  const monthlyEvolutions: (number | null)[] = []
  let totalCurrent = 0
  let totalPrevious = 0

  MONTHS.forEach((month) => {
    const currentData = currentMap.get(month)
    const previousData = previousMap.get(month)

    const currentCount = currentData?.count || 0
    const previousCount = previousData?.count || 0

    totalCurrent += currentCount
    totalPrevious += previousCount

    if (!currentData && !previousData) {
      monthlyEvolutions.push(null)
    } else {
      monthlyEvolutions.push(calculateEvolution(currentCount, previousCount))
    }
  })

  const totalEvolution = calculateEvolution(totalCurrent, totalPrevious)
  monthlyEvolutions.push(totalEvolution)

  return monthlyEvolutions
})

const turnoverEvolutions = computed(() => {
  const currentMap = createMonthMap(props.currentYearData)
  const previousMap = createMonthMap(props.previousYearData)

  const monthlyEvolutions: (number | null)[] = []
  let totalCurrent = 0
  let totalPrevious = 0

  MONTHS.forEach((month) => {
    const currentData = currentMap.get(month)
    const previousData = previousMap.get(month)

    const currentTurnover = currentData?.turnover || 0
    const previousTurnover = previousData?.turnover || 0

    totalCurrent += currentTurnover
    totalPrevious += previousTurnover

    if (!currentData && !previousData) {
      monthlyEvolutions.push(null)
    } else {
      monthlyEvolutions.push(
        calculateEvolution(currentTurnover, previousTurnover)
      )
    }
  })

  const totalEvolution = calculateEvolution(totalCurrent, totalPrevious)
  monthlyEvolutions.push(totalEvolution)

  return monthlyEvolutions
})

const formatEvolution = (evolution: number | null): string => {
  if (evolution === null) {
    return '--'
  }
  const sign = evolution >= 0 ? '+' : ''
  return `${sign}${evolution.toFixed(0)}%`
}

const getEvolutionClass = (evolution: number | null): string => {
  if (evolution === null) {
    return 'text-gray-400'
  }
  if (evolution > 0) {
    return 'text-green-600 font-medium'
  }
  if (evolution < 0) {
    return 'text-red-600 font-medium'
  }
  return 'text-gray-500'
}
</script>

<style scoped>
.evolution-container {
  width: 100%;
}
</style>
