<template lang="pug">
div
  .mb-6
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.customer') }}
    UInput.mb-4(
      v-model="customerSearch"
      :placeholder="$t('orders.create.searchCustomer')"
      icon="i-heroicons-magnifying-glass"
      @input="onCustomerSearchInput"
    )
    .space-y-2.max-h-48.overflow-y-auto.mb-4(v-if="customerResults.length > 0")
      .p-3.border.rounded.cursor-pointer.transition-colors(class="hover:bg-gray-50"
        v-for="customer in customerResults"
        :key="customer.uuid"
        @click="handleCustomerSelected(customer)"
      )
        .font-medium {{ customer.firstname }} {{ customer.lastname }}
        .text-sm.text-gray-500 {{ customer.email }} - {{ customer.phone }}
    UButton.mb-4(
      v-if="currentVM.get('customer').uuid"
      color="gray"
      variant="soft"
      icon="i-heroicons-x-mark-20-solid"
      @click="handleClearCustomer"
    ) {{ $t('orders.create.createNewCustomer') }}

  .grid.grid-cols-2.gap-4.mb-6
    UFormGroup(:label="$t('orders.create.firstname')" name="firstname")
      ft-text-field(
        :model-value="currentVM.get('customer').firstname"
        @update:model-value="customerFieldChanged('firstname', $event)"
      )
    UFormGroup(:label="$t('orders.create.lastname')" name="lastname")
      ft-text-field(
        :model-value="currentVM.get('customer').lastname"
        @update:model-value="customerFieldChanged('lastname', $event)"
      )
    UFormGroup(:label="$t('orders.create.email')" name="email")
      ft-text-field(
        :model-value="currentVM.get('customer').email"
        @update:model-value="customerFieldChanged('email', $event)"
      )
    UFormGroup(:label="$t('orders.create.phone')" name="phone")
      ft-text-field(
        :model-value="currentVM.get('customer').phone"
        @update:model-value="customerFieldChanged('phone', $event)"
      )

  .mb-6
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.deliveryAddress') }}
    .grid.grid-cols-2.gap-4
      UFormGroup(:label="$t('orders.create.firstname')" name="deliveryFirstname")
        ft-text-field(
          :model-value="currentVM.get('deliveryAddress').firstname"
          @update:model-value="deliveryFieldChanged('firstname', $event)"
        )
      UFormGroup(:label="$t('orders.create.lastname')" name="deliveryLastname")
        ft-text-field(
          :model-value="currentVM.get('deliveryAddress').lastname"
          @update:model-value="deliveryFieldChanged('lastname', $event)"
        )
      UFormGroup.col-span-2(:label="$t('orders.create.address')" name="deliveryAddress")
        ft-text-field(
          :model-value="currentVM.get('deliveryAddress').address"
          @update:model-value="deliveryFieldChanged('address', $event)"
        )
      UFormGroup(:label="$t('orders.create.zip')" name="deliveryZip")
        ft-text-field(
          :model-value="currentVM.get('deliveryAddress').zip"
          @update:model-value="deliveryFieldChanged('zip', $event)"
        )
      UFormGroup(:label="$t('orders.create.city')" name="deliveryCity")
        ft-text-field(
          :model-value="currentVM.get('deliveryAddress').city"
          @update:model-value="deliveryFieldChanged('city', $event)"
        )
      UFormGroup(:label="$t('orders.create.country')" name="deliveryCountry")
        ft-text-field(
          :model-value="currentVM.get('deliveryAddress').country"
          @update:model-value="deliveryFieldChanged('country', $event)"
        )

  .mb-6
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.billingAddress') }}
    UCheckbox.mb-4(
      :model-value="currentVM.get('sameAsDelivery')"
      :label="$t('orders.create.sameAsDelivery')"
      @update:model-value="sameAsDeliveryChanged"
    )
    .grid.grid-cols-2.gap-4(v-if="!currentVM.get('sameAsDelivery')")
      UFormGroup(:label="$t('orders.create.firstname')" name="billingFirstname")
        ft-text-field(
          :model-value="currentVM.get('billingAddress').firstname"
          @update:model-value="billingFieldChanged('firstname', $event)"
        )
      UFormGroup(:label="$t('orders.create.lastname')" name="billingLastname")
        ft-text-field(
          :model-value="currentVM.get('billingAddress').lastname"
          @update:model-value="billingFieldChanged('lastname', $event)"
        )
      UFormGroup.col-span-2(:label="$t('orders.create.address')" name="billingAddress")
        ft-text-field(
          :model-value="currentVM.get('billingAddress').address"
          @update:model-value="billingFieldChanged('address', $event)"
        )
      UFormGroup(:label="$t('orders.create.zip')" name="billingZip")
        ft-text-field(
          :model-value="currentVM.get('billingAddress').zip"
          @update:model-value="billingFieldChanged('zip', $event)"
        )
      UFormGroup(:label="$t('orders.create.city')" name="billingCity")
        ft-text-field(
          :model-value="currentVM.get('billingAddress').city"
          @update:model-value="billingFieldChanged('city', $event)"
        )
      UFormGroup(:label="$t('orders.create.country')" name="billingCountry")
        ft-text-field(
          :model-value="currentVM.get('billingAddress').country"
          @update:model-value="billingFieldChanged('country', $event)"
        )
</template>

<script lang="ts" setup>
import type { CreateOrderVM } from '@adapters/primary/view-models/orders/create-order/createOrderVM'
import type { Customer } from '@core/entities/customer'
import { searchCustomers } from '@core/usecases/customers/customer-searching/searchCustomer'
import { useSearchStore } from '@store/searchStore'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

const props = defineProps<{
  vm: CreateOrderVM
}>()

const currentVM = toRef(props, 'vm')
const customerSearch = ref('')
const searchStore = useSearchStore()
const searchGateway = useSearchGateway()
const namespace = 'manual-order-customer-search'

let debounceTimer: ReturnType<typeof setTimeout> | undefined

const customerResults = computed((): Array<Customer> => {
  return searchStore.get(namespace) || []
})

const onCustomerSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchCustomers(
      namespace,
      { query: customerSearch.value, minimumQueryLength: 3 },
      searchGateway
    )
  }, 300)
}

const handleCustomerSelected = (customer: Customer) => {
  currentVM.value.selectCustomer({
    uuid: customer.uuid,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phone: customer.phone
  })
  currentVM.value.set('deliveryAddress', {
    ...currentVM.value.get('deliveryAddress'),
    firstname: customer.firstname,
    lastname: customer.lastname
  })
  customerSearch.value = ''
  searchStore.set(namespace, [])
}

const handleClearCustomer = () => {
  currentVM.value.clearCustomer()
}

const customerFieldChanged = (field: string, value: string) => {
  const customer = { ...currentVM.value.get('customer'), [field]: value }
  currentVM.value.set('customer', customer)
}

const deliveryFieldChanged = (field: string, value: string) => {
  const address = { ...currentVM.value.get('deliveryAddress'), [field]: value }
  currentVM.value.set('deliveryAddress', address)
}

const billingFieldChanged = (field: string, value: string) => {
  const address = { ...currentVM.value.get('billingAddress'), [field]: value }
  currentVM.value.set('billingAddress', address)
}

const sameAsDeliveryChanged = (value: boolean) => {
  currentVM.value.set('sameAsDelivery', value)
  if (value) {
    currentVM.value.copyDeliveryToBilling()
  }
}
</script>
