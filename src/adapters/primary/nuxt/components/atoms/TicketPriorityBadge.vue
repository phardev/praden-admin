<template lang="pug">
.px-2.py-1.rounded.text-xs.font-medium(:class="badgeClass") {{ label }}
</template>

<script lang="ts" setup>
import { TicketPriority } from '@core/entities/ticket'

interface Props {
  priority: TicketPriority
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
  if (!props.priority) return `bg-gray-100 text-gray-800 ${sizeClasses.value}`

  const colorClasses = {
    URGENT: 'bg-red-100 text-red-800',
    HIGH: 'bg-orange-100 text-orange-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800'
  }

  const colorClass =
    colorClasses[props.priority as keyof typeof colorClasses] ||
    'bg-gray-100 text-gray-800'
  return `${colorClass} ${sizeClasses.value}`
})

const label = computed(() => {
  if (!props.priority) return ''
  return t(`support.priority.${props.priority.toLowerCase()}`)
})
</script>
