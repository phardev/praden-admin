<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") {{ $t('customers.editButton') }}
  h1.text-title {{ $t('customers.viewTitle') }}
  customer-form(
    :vm="vm"
  )
  h2.text-subtitle.mt-4 {{ $t('customers.ordersHistory') }}
  orders-list(
    :vm="ordersVM"
    :search-key="routeName"
    :initial-filters="{ customerUuid }"
  )
  h2.text-subtitle.mt-8 {{ $t('customers.supportTickets') }}
  customer-tickets-list(:customer-uuid="customerUuid")
  h2.text-subtitle.mt-8 {{ $t('loyalty.customer.history') }}
  customer-loyalty-section(:customer-uuid="customerUuid")
</template>

<script lang="ts" setup>
import { customerFormGetVM } from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { getCustomerTickets } from '@core/usecases/support/getCustomerTickets'
import { useCustomerGateway } from '../../../../../../../gateways/customerGateway'
import { useSearchGateway } from '../../../../../../../gateways/searchGateway'
import { useTicketGateway } from '../../../../../../../gateways/ticketGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const customerUuid = route.params.uuid as string
const router = useRouter()
const routeName = router.currentRoute.value.name as string

onMounted(async () => {
  const searchGateway = useSearchGateway()
  await searchOrders(routeName, { customerUuid }, searchGateway)
  const customerGateway = useCustomerGateway()
  await listCustomers(100, 0, customerGateway)
  await getCustomer(customerUuid, customerGateway)
  const ticketGateway = useTicketGateway()
  await getCustomerTickets(customerUuid, ticketGateway)
  vm.value = customerFormGetVM(routeName)
})

const ordersVM = computed(() => {
  return getOrdersVM(routeName)
})

const edit = () => {
  router.push(`/customers/edit/${customerUuid}`)
}
</script>
