<template lang="pug">
.space-y-4
  .flex.flex-wrap.items-end.gap-4
    ft-text-field.w-full(
      class="sm:w-80"
      :model-value="customerQuery"
      :placeholder="$t('support.filters.customerPlaceholder')"
      icon="i-lucide-search"
      @update:model-value="onCustomerQueryChange"
    )
    ft-period-filter(
      :start="startDate"
      :end="endDate"
      @update:start="startDate = $event"
      @update:end="endDate = $event"
      @apply="emitChange"
    )

  ft-filter-chips(
    :filters="activeFilters"
    @remove="removeFilter"
    @clear-all="clearFilters"
  )
</template>

<script lang="ts" setup>
import type { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'
import type { SupportTicketsFilters } from '@core/usecases/support/getSupportTickets'

const props = defineProps<{
  currentFilters: SupportTicketsFilters
  activeFilters: Array<ActiveFilterVM>
}>()

const emit = defineEmits<{
  (e: 'change', filters: SupportTicketsFilters): void
}>()

const debounceDelay = 300
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const customerQuery = ref(props.currentFilters.customerQuery ?? '')
const startDate = ref(props.currentFilters.startDate ?? null)
const endDate = ref(props.currentFilters.endDate ?? null)

watch(
  () => props.currentFilters,
  (filters) => {
    customerQuery.value = filters.customerQuery ?? ''
    startDate.value = filters.startDate ?? null
    endDate.value = filters.endDate ?? null
  },
  { deep: true }
)

const buildFilters = (): SupportTicketsFilters => ({
  ...(customerQuery.value ? { customerQuery: customerQuery.value } : {}),
  ...(startDate.value ? { startDate: startDate.value } : {}),
  ...(endDate.value ? { endDate: endDate.value } : {})
})

const emitChange = () => {
  emit('change', buildFilters())
}

const onCustomerQueryChange = (value: string) => {
  customerQuery.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(emitChange, debounceDelay)
}

const removeFilter = (filter: ActiveFilterVM) => {
  if (filter.key === 'customerQuery') customerQuery.value = ''
  if (filter.key === 'startDate') startDate.value = null
  if (filter.key === 'endDate') endDate.value = null
  emitChange()
}

const clearFilters = () => {
  customerQuery.value = ''
  startDate.value = null
  endDate.value = null
  emitChange()
}
</script>
