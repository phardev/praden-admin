<template lang="pug">
.space-y-4
  .flex.flex-wrap.items-end.gap-4
    ft-text-field.w-full(
      class="sm:w-80"
      :model-value="customerQuery"
      :placeholder="placeholder"
      :aria-label="placeholder"
      icon="i-lucide-search"
      @update:model-value="onCustomerQueryChange"
    )
    .relative.w-full(v-if="ean13Placeholder" class="sm:w-64")
      ft-text-field(
        :model-value="ean13Input"
        :placeholder="ean13Placeholder"
        :aria-label="ean13Placeholder"
        :aria-invalid="isEan13Incomplete"
        :color="isEan13Incomplete ? 'red' : 'white'"
        icon="i-lucide-barcode"
        inputmode="numeric"
        autocomplete="off"
        spellcheck="false"
        maxlength="16"
        @update:model-value="onEan13Change"
      )
      p.absolute.top-full.mt-1.text-xs.text-red-600(
        v-if="isEan13Incomplete"
        role="status"
      ) {{ $t('validation.ean13.incomplete') }}
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
import {
  type ActiveFilterVM,
  type CustomerPeriodFilters,
  ean13FilterOf,
  isIncompleteEan13
} from '@adapters/primary/view-models/shared/filters'

const props = defineProps<{
  currentFilters: CustomerPeriodFilters
  activeFilters: Array<ActiveFilterVM>
  placeholder: string
  ean13Placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'change', filters: CustomerPeriodFilters): void
}>()

const debounceDelay = 300
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const customerQuery = ref(props.currentFilters.customerQuery ?? '')
const ean13Input = ref(props.currentFilters.ean13 ?? '')
const startDate = ref(props.currentFilters.startDate ?? null)
const endDate = ref(props.currentFilters.endDate ?? null)

watch(
  () => props.currentFilters,
  (filters) => {
    customerQuery.value = filters.customerQuery ?? ''
    ean13Input.value = filters.ean13 ?? ''
    startDate.value = filters.startDate ?? null
    endDate.value = filters.endDate ?? null
  },
  { deep: true }
)

const isEan13Incomplete = computed(() => isIncompleteEan13(ean13Input.value))

const ean13ToApply = (): string | undefined =>
  isEan13Incomplete.value
    ? props.currentFilters.ean13
    : ean13FilterOf(ean13Input.value)

const buildFilters = (): CustomerPeriodFilters => ({
  ...(customerQuery.value ? { customerQuery: customerQuery.value } : {}),
  ...(ean13ToApply() ? { ean13: ean13ToApply() } : {}),
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

const onEan13Change = (value: string) => {
  ean13Input.value = value
  if (isEan13Incomplete.value) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(emitChange, debounceDelay)
}

const removeFilter = (filter: ActiveFilterVM) => {
  if (filter.key === 'customerQuery') customerQuery.value = ''
  if (filter.key === 'ean13') ean13Input.value = ''
  if (filter.key === 'startDate') startDate.value = null
  if (filter.key === 'endDate') endDate.value = null
  emitChange()
}

const clearFilters = () => {
  customerQuery.value = ''
  ean13Input.value = ''
  startDate.value = null
  endDate.value = null
  emitChange()
}
</script>
