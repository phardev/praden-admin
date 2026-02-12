<template lang="pug">
.px-2.py-1.rounded.text-xs.font-medium(:class="badgeClass") {{ label }}
</template>

<script lang="ts" setup>
import { TicketStatus } from '@core/entities/ticket'

interface Props {
  status: TicketStatus
  size?: 'xs' | 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'xs'
})

const { t } = useI18n()

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2 py-1',
    md: 'text-sm px-3 py-1'
  }
  return sizes[props.size as keyof typeof sizes]
})

const badgeClass = computed(() => {
  if (!props.status) return `bg-gray-100 text-gray-800 ${sizeClasses.value}`

  const colorClasses = {
    NEW: 'bg-blue-100 text-blue-800',
    STARTED: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800'
  }

  const colorClass =
    colorClasses[props.status as keyof typeof colorClasses] ||
    'bg-gray-100 text-gray-800'
  return `${colorClass} ${sizeClasses.value}`
})

const label = computed(() => {
  if (!props.status) return ''
  return t(`support.status.${props.status.toLowerCase()}`)
})
</script>
