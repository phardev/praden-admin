<template lang="pug">
div
  .mb-6
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.deliveryMethod') }}
    .space-y-3
      .p-4.border.rounded.cursor-pointer.transition-colors(
        v-for="method in deliveryMethods"
        :key="method.uuid"
        :class="isSelected(method.uuid) ? 'border-primary-500 bg-primary-50' : 'hover:bg-gray-50'"
        @click="selectDeliveryMethod(method.uuid)"
      )
        .flex.items-center.justify-between
          .flex.items-center.gap-3
            URadio(
              :model-value="currentVM.get('deliveryMethodUuid')"
              :value="method.uuid"
              @update:model-value="selectDeliveryMethod(method.uuid)"
            )
            div
              .font-medium {{ method.name }}
              .text-sm.text-gray-500 {{ method.description }}
          .text-sm.text-gray-600(v-if="method.priceRanges.length > 0")
            span {{ $t('orders.create.deliveryPrice') }}: {{ formatDeliveryPrice(method) }}

  .mt-6
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.customerMessage') }}
    UTextarea(
      :model-value="currentVM.get('customerMessage') || ''"
      :placeholder="$t('orders.create.customerMessage')"
      :rows="4"
      @update:model-value="customerMessageChanged"
    )
</template>

<script lang="ts" setup>
import type { CreateOrderVM } from '@adapters/primary/view-models/orders/create-order/createOrderVM'
import type { DeliveryMethod } from '@core/entities/order'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'

const props = defineProps<{
  vm: CreateOrderVM
}>()

const currentVM = toRef(props, 'vm')
const deliveryMethodStore = useDeliveryMethodStore()

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
})

const deliveryMethods = computed((): Array<DeliveryMethod> => {
  return deliveryMethodStore.items
})

const isSelected = (uuid: string): boolean => {
  return currentVM.value.get('deliveryMethodUuid') === uuid
}

const selectDeliveryMethod = (uuid: string) => {
  currentVM.value.set('deliveryMethodUuid', uuid)
}

const formatDeliveryPrice = (method: DeliveryMethod): string => {
  if (method.priceRanges.length === 0) return '-'
  const minPrice = Math.min(...method.priceRanges.map((r) => r.price))
  const maxPrice = Math.max(...method.priceRanges.map((r) => r.price))
  if (minPrice === maxPrice) return formatter.format(minPrice / 100)
  return `${formatter.format(minPrice / 100)} - ${formatter.format(maxPrice / 100)}`
}

const customerMessageChanged = (value: string) => {
  currentVM.value.set('customerMessage', value || undefined)
}

onMounted(() => {
  if (deliveryMethodStore.items.length === 0) {
    listDeliveryMethods(useDeliveryMethodGateway())
  }
})
</script>
