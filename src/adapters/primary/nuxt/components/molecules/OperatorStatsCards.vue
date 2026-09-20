<template lang="pug">
.grid.grid-cols-1.gap-4(class="sm:grid-cols-3")
  .bg-light.rounded-lg.p-4(v-for="kpi in kpis" :key="kpi.metric")
    p.text-sm.text-contrast.font-medium {{ $t(kpi.labelKey) }}
    p.text-2xl.font-bold.text-default {{ kpi.average }}
    p.text-sm.text-contrast {{ $t('staff.statistics.kpi.total', { total: kpi.total }) }}
</template>

<script setup lang="ts">
import type { OperatorStatsKpiVM } from '@adapters/primary/view-models/staff/operator-statistics/getOperatorStatisticsVM'

defineProps<{
  kpis: Array<OperatorStatsKpiVM>
}>()
</script>
