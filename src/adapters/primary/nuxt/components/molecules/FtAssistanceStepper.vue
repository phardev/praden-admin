<template lang="pug">
.flex.items-center.rounded-2xl.border.border-gray-100.bg-white.px-7.py-5.shadow-sm
  template(v-for="(step, index) in steps" :key="step.key")
    .mx-3.flex-1(v-if="index > 0" class="h-0.5" :class="connectorClass(index)")
    .flex.items-center(class="gap-2.5")
      .flex.h-7.w-7.items-center.justify-center.rounded-full(:class="circleClass(index)")
        UIcon.h-4.w-4(v-if="isDone(index)" name="i-heroicons-check")
        .rounded-full.bg-customPrimary-500(v-else-if="isCurrent(index)" class="h-2.5 w-2.5")
      span.text-sm(:class="labelClass(index)") {{ $t(step.labelKey) }}
</template>

<script lang="ts" setup>
const props = defineProps<{
  current: 0 | 1 | 2
  isCancelled: boolean
}>()

const steps = computed(() => [
  { key: 'received', labelKey: 'assistance.details.steps.received' },
  { key: 'inProgress', labelKey: 'assistance.details.steps.inProgress' },
  {
    key: 'last',
    labelKey: props.isCancelled
      ? 'assistance.details.steps.cancelled'
      : 'assistance.details.steps.resolved'
  }
])

const isDone = (index: number): boolean => index < props.current
const isCurrent = (index: number): boolean => index === props.current
const isCancelledStep = (index: number): boolean =>
  props.isCancelled && index === steps.value.length - 1

const connectorClass = (index: number): string =>
  index <= props.current ? 'bg-customPrimary-500' : 'bg-gray-200'

const circleClass = (index: number): string => {
  if (isDone(index)) return 'bg-customPrimary-500 text-white'
  if (isCurrent(index)) return 'bg-white ring-2 ring-customPrimary-500'
  return 'bg-white ring-2 ring-gray-300'
}

const labelClass = (index: number): string => {
  if (isCancelledStep(index)) return 'text-gray-400'
  if (isCurrent(index)) return 'font-semibold text-gray-900'
  if (isDone(index)) return 'font-medium text-gray-900'
  return 'font-medium text-gray-400'
}
</script>
