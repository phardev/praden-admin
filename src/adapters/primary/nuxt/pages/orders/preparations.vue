<template lang="pug">
.section
  fv-table(
    :headers="ordersVM.headers"
    :items="ordersVM.items"
    :selectable="true"
    :selection="ordersSelectedVM.items"
    @item-selected="select"
    @select-all="selectAll"
  )
    template(#title) Commandes à préparer
    template(#reference="{ item }")
      .font-medium.text-default {{ item.reference }}
    template(#createdDate="{ item }")
      time(:datetime='item.createdDatetime') {{ item.createdDate }}
  div.w-full.flex.flex-row-reverse
    ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
      v-if="ordersSelectedVM.items.length > 0"
    ) Commencer les préparations
</template>

<script lang="ts" setup>
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { getOrdersToPrepareVM } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/get-selected-preparations/getSelectedPreparationsVM'
import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'
import { toggleSelectAllPreparations } from '@core/usecases/order/toggle-select-all-preparations/toggleSelectAllPreparations'
import FtButton from '@adapters/primary/nuxt/components/FtButton.vue'
import { startPreparationsVM } from '@adapters/primary/view-models/start-preparations/startPreparationsVM'

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

const selectAll = () => {
  toggleSelectAllPreparations()
}
</script>
