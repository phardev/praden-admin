<template lang="pug">
ft-table(
  :headers="vm.headers"
  :items="vm.items"
  :is-loading="vm.isLoading"
  item-key="reference"
)
  template(#reference="{ item }")
    nuxt-link.font-medium.text-link(:href="item.href") {{ item.reference }}
  template(#createdDate="{ item }")
    time(:datetime='item.createdDatetime') {{ item.createdDate }}
  template(#status="{ item }")
    ft-delivery-status-badge(:status="item.deliveryStatus")
  template(#paymentStatus="{ item }")
    ft-payment-status-badge(:status="item.paymentStatus")
</template>

<script lang="ts" setup>
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { listOrders } from '@core/usecases/order/list-orders/listOrders'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listOrders(useOrderGateway())
})

defineProps({
  vm: {
    type: Object,
    default() {
      return {}
    }
  }
})
</script>
