<template lang="pug">
.section
  .px-4(class='sm:px-6 lg:px-8')
  div(class='sm:flex sm:items-center')
    div(class='sm:flex-auto')
      h1.text-2xl.font-semibold.text-default Commandes à préparer
  .-mx-4.mt-10.ring-1.ring-light(class='sm:-mx-6 md:mx-0 md:rounded-lg')
    table.min-w-full.divide-y.divide-light
      thead.bg-contrast
        tr
          th(scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8")
            input(type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light text-colored focus:ring-colored sm:left-6")
          th.pl-4.pr-3.text-left.text-sm.font-semibold.text-default(
              v-for="(header, headerIndex) in ordersVM.headers"
              :key="headerIndex"
              :class="[headerIndex === 0 ? 'pl-4 pr-3 sm:pl-6' : 'px-3 lg:table-cell', 'text-left text-sm font-semibold text-default py-3.5']"
              scope='col'
            ) {{ header }}
      tbody
        tr(v-for='(order) in ordersVM.items' :key='order.reference')
          td.border-t.border-light(class="relative w-12 px-6 sm:w-16 sm:px-8")
            div(v-if="false" class="absolute inset-y-0 left-0 w-0.5 bg-contrast")
            input(type="checkbox" class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-light text-colored focus:ring-colored sm:left-6")
          td.border-t.border-light.px-3.py-3.text-sm.text-contrast
            .font-medium.text-default {{ order.reference }}
          td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ order.client }}
          td.border-t.border-light.px-3.py-3.text-sm.text-contrast
            time(:datetime='order.createdDatetime') {{ order.createdDate }}
          td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ order.total }}
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
