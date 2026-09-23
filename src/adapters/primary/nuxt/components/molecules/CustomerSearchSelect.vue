<template lang="pug">
div
  div(v-if="!vm.selected")
    ft-text-field(
      v-model="search"
      :placeholder="$t('orders.create.customer.searchPlaceholder')"
      for="order-create-customer-search"
      type="text"
      name="order-create-customer-search"
      @input="searchChanged"
    ) {{ $t('orders.create.customer.searchLabel') }}
    p.text-sm.text-warning.mt-1(v-if="vm.hasError") {{ $t('orders.create.customer.minimumSearch') }}
    .space-y-3.mt-4(v-if="vm.isLoading")
      USkeleton.h-16(v-for="n in 3" :key="n")
    .space-y-2.mt-4(v-else-if="vm.results.length > 0")
      .p-4.bg-white.border.rounded.flex.items-center.justify-between(
        v-for="customer in vm.results"
        :key="customer.uuid"
      )
        .flex-1
          .font-medium {{ customer.fullname }}
          .text-sm.text-gray-600 {{ customer.contact }}
        UButton(
          color="primary"
          variant="soft"
          icon="i-heroicons-plus"
          :label="$t('orders.create.customer.select')"
          @click="$emit('selected', customer.uuid)"
        )
    .text-center.py-4.text-gray-500(v-else-if="vm.hasSearchedQuery")
      p {{ $t('orders.create.customer.noResults') }}
  UCard(v-else)
    .flex.items-center.justify-between
      div
        .font-medium {{ vm.selected.fullname }}
        .text-sm.text-gray-600 {{ vm.selected.contact }}
        .text-sm.text-colored.mt-1(v-if="vm.selected.loyaltyBalance !== undefined") {{ $t('orders.create.customer.loyaltyPoints', { count: vm.selected.loyaltyBalance }) }}
      UButton(
        color="gray"
        variant="ghost"
        :label="$t('orders.create.customer.change')"
        @click="$emit('change')"
      )
</template>

<script lang="ts" setup>
import type { SearchableCustomer } from '@adapters/primary/view-models/customers/customer-search/customerSearchVM'
import { customerSearchVM } from '@adapters/primary/view-models/customers/customer-search/customerSearchVM'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { clearSearch } from '@core/usecases/search/search-clearing/clearSearch'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

const props = withDefaults(
  defineProps<{
    selectedCustomer?: SearchableCustomer
    namespace?: string
  }>(),
  { selectedCustomer: undefined, namespace: 'order-create-customer' }
)

defineEmits<{
  (e: 'selected', customerUuid: string): void
  (e: 'change'): void
}>()

const namespace = props.namespace
const minimumQueryLength = 3
const search = ref('')

const vm = computed(() => {
  return customerSearchVM(namespace, props.selectedCustomer)
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const searchChanged = (e: Event) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    const target = e.target as HTMLInputElement
    const query = target.value
    if (!query) {
      clearSearch(namespace)
    } else {
      searchCustomers(
        namespace,
        { query, minimumQueryLength },
        useSearchGateway()
      )
    }
  }, 300)
}
</script>
