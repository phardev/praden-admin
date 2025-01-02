<template lang="pug">
.section
  div En cours
//  ft-table(
//    :headers="deliveriesVM.headers"
//    :is-loading="deliveriesVM.isLoading"
//    :items="deliveriesVM.items"
//  )
//    template(#title) Livraisons
//    template(#status="{ item }")
//      ft-delivery-status-badge(:status="item.status")
</template>

<script lang="ts" setup>
import { listDeliveries } from '@core/usecases/deliveries/delivery-listing/listDeliveries'
import { useDeliveryGateway } from '../../../../../../gateways/deliveryGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listDeliveries(useDeliveryGateway())
})
</script>
