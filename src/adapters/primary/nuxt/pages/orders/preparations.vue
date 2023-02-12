<template lang="pug">
.section
  fv-table(
    :headers="ordersVM.headers"
    :items="ordersVM.items"
    :selectable="true"
    :selection="ordersSelectedVM.items"
    @item-selected="select"
  )
    template(#title) Commandes à préparer
    template(#reference="{ item }")
      .font-medium.text-default {{ item.reference }}
    template(#createdDate="{ item }")
      time(:datetime='item.createdDatetime') {{ item.createdDate }}
</template>

<script lang="ts" setup>
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { getOrdersToPrepareVM } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/get-selected-preparations/getSelectedPreparationsVM'
import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'

onMounted(() => {
  listOrdersToPrepare(useOrderGateway())
})

const ordersVM = computed(() => {
  return getOrdersToPrepareVM()
})

const ordersSelectedVM = computed(() => {
  return getSelectedPreparationsVM()
})

const select = (selected: any) => {
  toggleSelectPreparation(selected.reference)
}
</script>
