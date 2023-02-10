<template lang="pug">
.section
  fv-table(
    :headers="ordersVM.headers"
    :items="ordersVM.items"
  )
    template(#reference="{ item }")
      .font-medium.text-default {{ item.reference }}
    template(#createdDate="{ item }")
      time(:datetime='item.createdDatetime') {{ item.createdDate }}
</template>

<script lang="ts" setup>
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { getOrdersToPrepareVM } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'

onMounted(() => {
  listOrdersToPrepare(useOrderGateway())
})

const ordersVM = computed(() => {
  return getOrdersToPrepareVM()
})
</script>
