<template lang="pug">
span.inline-flex.items-center.whitespace-nowrap.rounded.px-2.py-1.text-xs.font-medium(:class="badgeClass") {{ $t(`assistance.status.${status.toLowerCase()}`) }}
</template>

<script lang="ts" setup>
import type { AssistanceRequestStatus } from '@core/entities/assistanceRequest'

const props = defineProps<{
  status: AssistanceRequestStatus
}>()

const colorClasses: Record<AssistanceRequestStatus, string> = {
  RECEIVED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_FOR_YOUR_ANSWER: 'bg-orange-100 text-orange-800',
  ON_HOLD: 'bg-gray-100 text-gray-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-500 line-through'
}

const badgeClass = computed(
  () => colorClasses[props.status as AssistanceRequestStatus]
)
</script>
