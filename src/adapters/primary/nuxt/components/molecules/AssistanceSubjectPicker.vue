<template lang="pug">
div.relative(
  ref="root"
  @focusin="isDropdownOpen = true"
  @focusout="onFocusOut"
  @keydown.down.prevent="moveHighlight(1)"
  @keydown.up.prevent="moveHighlight(-1)"
  @keydown.enter.prevent="pickHighlighted"
  @keydown.esc="onEscape"
)
  label.block.text-sm.font-medium.text-gray-700.mb-1(:for="inputId") {{ $t(`assistance.panel.which.${category.toLowerCase()}`) }}
  UInput(
    :id="inputId"
    :model-value="query"
    icon="i-heroicons-magnifying-glass"
    :placeholder="$t(`assistance.panel.searchPlaceholder.${subjectType.toLowerCase()}`)"
    autofocus
    autocomplete="off"
    role="combobox"
    :aria-expanded="showDropdown"
    @update:model-value="onQueryChanged"
  )
  p.text-sm.text-gray-500.mt-1(v-if="search.isQueryTooShort") {{ $t('assistance.panel.minimumSearch') }}
  div.absolute.left-0.right-0.top-full.mt-1.bg-white.rounded-lg.shadow-lg.ring-1.ring-gray-200.p-1.z-10(v-if="showDropdown")
    div.space-y-1(v-if="search.isLoading")
      USkeleton.h-10(v-for="n in SKELETON_ROWS" :key="n")
    ul(v-else-if="search.results.length > 0" role="listbox")
      li.px-3.py-2.rounded-md.cursor-pointer(
        v-for="(option, index) in search.results"
        :key="option.uuid"
        role="option"
        :aria-selected="index === highlightedIndex"
        :class="index === highlightedIndex ? 'bg-customPrimary-50' : 'hover:bg-gray-50'"
        @mousedown.prevent="pick(option)"
        @mouseenter="highlightedIndex = index"
      )
        p.text-sm.font-semibold.text-gray-900 {{ option.label }}
        p.text-xs.text-gray-500 {{ option.secondaryLabel }}
    p.px-3.py-2.text-sm.text-gray-500(v-else-if="search.hasNoResults") {{ $t('assistance.panel.noResults') }}
</template>

<script lang="ts" setup>
import type { SubjectOptionVM } from '@adapters/primary/view-models/assistance/assistance-subject-search/assistanceSubjectSearchVM'
import {
  assistanceSubjectNamespace,
  assistanceSubjectSearchVM,
  MINIMUM_QUERY_LENGTH
} from '@adapters/primary/view-models/assistance/assistance-subject-search/assistanceSubjectSearchVM'
import type {
  AssistanceRequestCategory,
  AssistanceSubject
} from '@core/entities/assistanceRequest'
import { AssistanceSubjectType } from '@core/entities/assistanceRequest'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { clearSearch } from '@core/usecases/search/search-clearing/clearSearch'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

const props = defineProps<{
  subjectType: AssistanceSubjectType
  category: AssistanceRequestCategory
  query: string
}>()

const emit = defineEmits<{
  (e: 'update:query', query: string): void
  (e: 'selected', subject: AssistanceSubject): void
}>()

const DEBOUNCE_MS = 300
const PAGE_SIZE = 8
const SKELETON_ROWS = 3

const root = ref<HTMLElement>()
const inputId = `assistance-subject-${props.subjectType.toLowerCase()}`
const isDropdownOpen = ref(false)
const highlightedIndex = ref(0)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const namespace = computed(() => assistanceSubjectNamespace(props.subjectType))

const search = computed(() =>
  assistanceSubjectSearchVM(props.subjectType, props.query)
)

const showDropdown = computed(
  () =>
    isDropdownOpen.value &&
    props.query.length > 0 &&
    !search.value.isQueryTooShort &&
    (search.value.isLoading ||
      search.value.results.length > 0 ||
      search.value.hasNoResults)
)

const runSearch = (query: string) => {
  const gateway = useSearchGateway()
  const key = namespace.value
  switch (props.subjectType) {
    case AssistanceSubjectType.ORDER:
      return searchOrders(
        key,
        { query, minimumQueryLength: MINIMUM_QUERY_LENGTH, size: PAGE_SIZE },
        gateway
      )
    case AssistanceSubjectType.PRODUCT:
      return searchProducts(
        key,
        { query, minimumQueryLength: MINIMUM_QUERY_LENGTH, size: PAGE_SIZE },
        gateway
      )
    default:
      return searchCustomers(
        key,
        { query, minimumQueryLength: MINIMUM_QUERY_LENGTH },
        gateway
      )
  }
}

const onQueryChanged = (value: string) => {
  emit('update:query', value)
  isDropdownOpen.value = true
  highlightedIndex.value = 0
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (!value) clearSearch(namespace.value)
    else runSearch(value).catch(() => clearSearch(namespace.value))
  }, DEBOUNCE_MS)
}

const pick = (option: SubjectOptionVM) => {
  isDropdownOpen.value = false
  emit('selected', {
    type: props.subjectType,
    label: option.label,
    uuid: option.uuid,
    pageUrl: option.pageUrl
  })
}

const pickHighlighted = () => {
  const option = search.value.results[highlightedIndex.value]
  if (showDropdown.value && option) pick(option)
}

const moveHighlight = (offset: number) => {
  const count = search.value.results.length
  if (count === 0) return
  isDropdownOpen.value = true
  highlightedIndex.value = (highlightedIndex.value + offset + count) % count
}

const onFocusOut = (event: FocusEvent) => {
  const next = event.relatedTarget
  if (next instanceof Node && root.value?.contains(next)) return
  isDropdownOpen.value = false
}

const onEscape = (event: KeyboardEvent) => {
  if (!showDropdown.value) return
  event.stopPropagation()
  isDropdownOpen.value = false
}

const focus = () => {
  root.value?.querySelector('input')?.focus()
}

defineExpose({ focus })

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  clearSearch(namespace.value)
})
</script>
