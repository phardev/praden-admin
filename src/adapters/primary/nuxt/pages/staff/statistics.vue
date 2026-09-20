<template lang="pug">
.section.space-y-8
  h1.text-page-title.flex-grow {{ $t('staff.statistics.title') }}

  ft-period-filter(
    v-model:start="startDate"
    v-model:end="endDate"
    @apply="refresh"
  )

  UAlert(
    v-if="vm.emptyReason === 'before-data-start'"
    icon="i-heroicons-information-circle"
    color="primary"
    variant="soft"
    :title="$t('staff.statistics.dataAvailableFrom')"
  )

  operator-stats-cards(v-if="vm.kpis.length" :kpis="vm.kpis")

  section.space-y-3
    h2.text-lg.font-bold.text-default {{ $t('staff.statistics.operators') }}
    operator-stats-list(
      :rows="vm.rows"
      :inactive-staff-count="vm.inactiveStaffCount"
      :is-loading="vm.isLoading"
      @select="selectOperator"
    )

  section.space-y-3(v-if="vm.hasData")
    .flex.flex-wrap.items-center.justify-between.gap-3
      h2.text-lg.font-bold.text-default
        | {{ $t('staff.statistics.evolution', { name: selectionName }) }}
      .flex.gap-2(role="group" :aria-label="$t('staff.statistics.metric.legend')")
        UButton(
          v-for="metric in metricOptions"
          :key="metric.key"
          :label="$t(metric.labelKey)"
          :color="metric.key === vm.selectedMetric ? 'primary' : 'gray'"
          :variant="metric.key === vm.selectedMetric ? 'solid' : 'soft'"
          :aria-pressed="metric.key === vm.selectedMetric"
          size="sm"
          class="cursor-pointer transition-colors duration-200 min-h-11"
          @click="selectMetric(metric.key)"
        )
    .h-80.bg-light.rounded-lg.p-2
      operator-daily-chart(
        :points="vm.chartPoints"
        :aria-label="chartAriaLabel"
        :value-label="$t(selectedMetricLabelKey)"
      )
    details.rounded-lg.ring-1.ring-light
      summary.cursor-pointer.px-4.py-3.text-sm.font-medium.text-default {{ $t('staff.statistics.showData') }}
      .overflow-x-auto
        table.min-w-full.divide-y.divide-light
          thead.bg-contrast
            tr
              th.py-3.pl-4.pr-3.text-left.text-sm.font-semibold.text-default(scope="col") {{ $t('staff.statistics.table.day') }}
              th.px-3.py-3.text-right.text-sm.font-semibold.text-default(scope="col") {{ $t('staff.statistics.table.orders') }}
              th.px-3.py-3.text-right.text-sm.font-semibold.text-default(scope="col") {{ $t('staff.statistics.table.lines') }}
              th.px-3.py-3.text-right.text-sm.font-semibold.text-default(scope="col") {{ $t('staff.statistics.table.boxes') }}
          tbody
            tr(v-for="dailyRow in vm.dailyRows" :key="dailyRow.day")
              td.border-t.border-light.py-3.pl-4.pr-3.text-sm.text-default {{ dailyRow.day }}
              td.border-t.border-light.px-3.py-3.text-sm.text-right.text-default {{ dailyRow.orders }}
              td.border-t.border-light.px-3.py-3.text-sm.text-right.text-default {{ dailyRow.lines }}
              td.border-t.border-light.px-3.py-3.text-sm.text-right.text-default {{ dailyRow.boxes }}

  p.text-sm.text-contrast(v-else-if="!vm.isLoading") {{ $t('staff.statistics.noData') }}
</template>

<script lang="ts" setup>
import { getOperatorStatisticsVM } from '@adapters/primary/view-models/staff/operator-statistics/getOperatorStatisticsVM'
import { getOperatorStatistics } from '@core/usecases/staff/get-operator-statistics/getOperatorStatistics'
import type { OperatorMetric } from '@store/statsStore'
import { useStatsStore } from '@store/statsStore'
import { useOperatorStatisticsGateway } from '../../../../../../gateways/operatorStatisticsGateway'

definePageMeta({ layout: 'main' })

const { t } = useI18n()
const statsStore = useStatsStore()

const DEFAULT_PERIOD_IN_DAYS = 30

const buildDefaultStart = (): number => {
  const from = new Date()
  from.setDate(from.getDate() - (DEFAULT_PERIOD_IN_DAYS - 1))
  from.setHours(0, 0, 0, 0)
  return from.getTime()
}

const buildDefaultEnd = (): number => {
  const to = new Date()
  to.setHours(23, 59, 59, 999)
  return to.getTime()
}

const startDate = ref<number | null>(buildDefaultStart())
const endDate = ref<number | null>(buildDefaultEnd())

const metricOptions: Array<{ key: OperatorMetric; labelKey: string }> = [
  { key: 'orders', labelKey: 'staff.statistics.metric.orders' },
  { key: 'lines', labelKey: 'staff.statistics.metric.lines' },
  { key: 'boxes', labelKey: 'staff.statistics.metric.boxes' }
]

const vm = computed(() => getOperatorStatisticsVM())

const selectionName = computed(() =>
  vm.value.isTeamSelected ? t('staff.statistics.team') : vm.value.selectedName
)

const selectedMetricLabelKey = computed(
  () =>
    metricOptions.find((metric) => metric.key === vm.value.selectedMetric)
      ?.labelKey ?? metricOptions[0].labelKey
)

const chartAriaLabel = computed(() =>
  t('staff.statistics.chartAriaLabel', {
    metric: t(selectedMetricLabelKey.value),
    name: selectionName.value,
    period: vm.value.periodLabel
  })
)

const refresh = async () => {
  await getOperatorStatistics(
    {
      startDate: startDate.value ? new Date(startDate.value) : undefined,
      endDate: endDate.value ? new Date(endDate.value) : undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    useOperatorStatisticsGateway()
  )
}

const selectOperator = (uuid: string | undefined) => {
  statsStore.selectOperator(uuid)
}

const selectMetric = (metric: OperatorMetric) => {
  statsStore.selectMetric(metric)
}

onMounted(refresh)
</script>
