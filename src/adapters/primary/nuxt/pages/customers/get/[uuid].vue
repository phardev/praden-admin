<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer client
  h1.text-title Voir client
  customer-form(
    :vm="vm"
  )
  h2.text-subtitle.mt-4 Historique des commandes
  orders-list(
    :vm="ordersVM"
    :search-key="routeName"
    :initial-filters="{ customerUuid }"
  )
</template>

<script lang="ts" setup>
import { useCustomerGateway } from '../../../../../../../gateways/customerGateway'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { customerFormGetVM } from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { useSearchGateway } from '../../../../../../../gateways/searchGateway'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const customerUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  const searchGateway = useSearchGateway()
  await searchOrders(routeName, { customerUuid }, searchGateway)
  const customerGateway = useCustomerGateway()
  listCustomers(customerGateway)
  await getCustomer(customerUuid, customerGateway)
  vm.value = customerFormGetVM(routeName)
})

const ordersVM = computed(() => {
  return getOrdersVM(routeName)
})

const edit = () => {
  router.push(`/customers/edit/${customerUuid}`)
}
</script>
