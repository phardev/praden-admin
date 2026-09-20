<template lang="pug">
.ring-1.ring-light.rounded-lg.overflow-x-auto
  table.min-w-full.divide-y.divide-light
    thead.bg-contrast
      tr
        th.w-12(scope="col")
          span.sr-only {{ $t('staff.statistics.table.select') }}
        th.pl-4.pr-3.text-left.text-sm.font-semibold.text-default(class="py-3.5" scope="col") {{ $t('staff.statistics.table.operator') }}
        th.px-3.text-right.text-sm.font-semibold.text-default(class="py-3.5" scope="col") {{ $t('staff.statistics.table.activeDays') }}
        th.px-3.text-right.text-sm.font-semibold.text-default(
          v-for="column in countColumns"
          :key="column.metric"
          class="py-3.5"
          scope="col"
        ) {{ $t(column.labelKey) }}
    tbody(v-if="isLoading")
      tr(v-for="skeletonRow in 4" :key="skeletonRow")
        td.px-3.py-4(v-for="skeletonCell in 6" :key="skeletonCell")
          USkeleton(class="h-4 w-full")
    tbody(v-else)
      tr.cursor-pointer.transition-colors.duration-200(
        v-for="row in rows"
        :key="row.uuid ?? 'team'"
        :class="rowClass(row)"
        @click="$emit('select', row.uuid)"
      )
        td.relative.w-12.px-4
          .absolute.inset-y-0.left-0.w-1(v-if="row.isSelected" class="bg-primary-600")
          input.h-4.w-4.cursor-pointer(
            type="radio"
            name="operator-statistics-selection"
            class="border-light text-colored focus-visible:ring-2 focus-visible:ring-colored"
            :checked="row.isSelected"
            :aria-label="row.isTeam ? $t('staff.statistics.team') : row.name"
            @change="$emit('select', row.uuid)"
          )
        td.border-t.border-light.py-4.pl-4.pr-3.text-sm.font-medium.text-default
          template(v-if="row.isTeam") {{ $t('staff.statistics.team') }}
          template(v-else) {{ row.name }}
        td.border-t.border-light.px-3.py-4.text-sm.text-right.text-contrast {{ row.activeDays }}
        td.border-t.border-light.px-3.py-4.text-right(
          v-for="column in countColumns"
          :key="column.metric"
        )
          p.text-sm.text-default {{ row[column.metric] }}
          p.text-xs.text-contrast {{ $t('staff.statistics.table.perDay', { value: row[column.perDayKey] }) }}
  p.px-4.py-3.text-sm.text-contrast(v-if="!isLoading && inactiveStaffCount > 0")
    | {{ $t('staff.statistics.inactiveStaff', { count: inactiveStaffCount }) }}
</template>

<script setup lang="ts">
import type { OperatorStatsRowVM } from '@adapters/primary/view-models/staff/operator-statistics/getOperatorStatisticsVM'

defineProps<{
  rows: Array<OperatorStatsRowVM>
  inactiveStaffCount: number
  isLoading: boolean
}>()

defineEmits<{
  select: [uuid: string | undefined]
}>()

const countColumns = [
  {
    metric: 'orders' as const,
    perDayKey: 'ordersPerDay' as const,
    labelKey: 'staff.statistics.table.orders'
  },
  {
    metric: 'lines' as const,
    perDayKey: 'linesPerDay' as const,
    labelKey: 'staff.statistics.table.lines'
  },
  {
    metric: 'boxes' as const,
    perDayKey: 'boxesPerDay' as const,
    labelKey: 'staff.statistics.table.boxes'
  }
]

const rowClass = (row: OperatorStatsRowVM) =>
  row.isSelected ? 'bg-light' : 'hover:bg-light'
</script>
