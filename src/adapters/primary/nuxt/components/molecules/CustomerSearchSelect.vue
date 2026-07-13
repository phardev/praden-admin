<template lang="pug">
div
  div(v-if="!selectedCustomer")
    ft-text-field(
      v-model="search"
      :placeholder="$t('orders.create.customer.searchPlaceholder')"
      for="order-create-customer-search"
      type="text"
      name="order-create-customer-search"
      @input="searchChanged"
    ) {{ $t('orders.create.customer.searchLabel') }}
    p.text-sm.text-warning.mt-1(v-if="hasSearchError") {{ $t('orders.create.customer.minimumSearch') }}
    .space-y-3.mt-4(v-if="isLoading")
      USkeleton.h-16(v-for="n in 3" :key="n")
    .space-y-2.mt-4(v-else-if="results.length > 0")
      .p-4.bg-white.border.rounded.flex.items-center.justify-between(
        v-for="customer in results"
        :key="customer.uuid"
      )
        .flex-1
          .font-medium {{ customer.firstname }} {{ customer.lastname }}
          .text-sm.text-gray-600 {{ customer.email }} · {{ customer.phone }}
        UButton(
          color="primary"
          variant="soft"
          icon="i-heroicons-plus"
          :label="$t('orders.create.customer.select')"
          @click="$emit('selected', customer.uuid)"
        )
    .text-center.py-4.text-gray-500(v-else-if="hasSearchedQuery")
      p {{ $t('orders.create.customer.noResults') }}
  UCard(v-else)
    .flex.items-center.justify-between
      div
        .font-medium {{ selectedCustomer.firstname }} {{ selectedCustomer.lastname }}
        .text-sm.text-gray-600 {{ selectedCustomer.email }} · {{ selectedCustomer.phone }}
        .text-sm.text-colored.mt-1(v-if="selectedCustomer.loyalty") {{ $t('orders.create.customer.loyaltyPoints', { count: selectedCustomer.loyalty.balance }) }}
      UButton(
        color="gray"
        variant="ghost"
        :label="$t('orders.create.customer.change')"
        @click="$emit('change')"
      )
</template>

<script lang="ts" setup>
import type { Customer } from '@core/entities/customer'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchStore } from '@store/searchStore'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

defineProps<{
  selectedCustomer?: Customer
}>()

defineEmits<{
  (e: 'selected', customerUuid: string): void
  (e: 'change'): void
}>()

const namespace = 'order-create-customer'
const minimumQueryLength = 3
const search = ref('')
const searchStore = useSearchStore()

const results = computed<Array<Customer>>(() => {
  return searchStore.get(namespace) || []
})

const hasSearchError = computed(() => {
  return !!searchStore.getError(namespace)
})

const isLoading = computed(() => {
  return searchStore.isLoading(namespace)
})

const hasSearchedQuery = computed(() => {
  return (
    !!searchStore.getFilter(namespace)?.query &&
    !hasSearchError.value &&
    !isLoading.value
  )
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
      searchStore.set(namespace, [])
      searchStore.setFilter(namespace, undefined)
      searchStore.setError(namespace, undefined)
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
