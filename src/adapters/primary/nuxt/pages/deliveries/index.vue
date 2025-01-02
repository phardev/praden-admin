<template lang="pug">
.section
  ft-table(
    :headers="deliveriesVM.headers"
    :is-loading="deliveriesVM.isLoading"
    :items="deliveriesVM.items"
  )
    template(#title) Livraisons
    template(#status="{ item }")
      ft-delivery-status-badge(:status="item.status")
</template>

<script lang="ts" setup>
import { listDeliveries } from '@core/usecases/deliveries/delivery-listing/listDeliveries'
import { useDeliveryGateway } from '../../../../../../gateways/deliveryGateway'
import { getDeliveriesVM } from '@adapters/primary/view-models/deliveries/get-deliveries-vm/getDeliveriesVM'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listDeliveries(useDeliveryGateway())
})

const deliveriesVM = computed(() => {
  return getDeliveriesVM()
})
</script>
