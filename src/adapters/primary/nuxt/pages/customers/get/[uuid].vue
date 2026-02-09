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

  h2.text-subtitle.mt-8 {{ $t('loyalty.points.title') }}
  .flex.items-center.gap-4.mt-4
    .text-2xl.font-bold {{ loyaltyVM.balance }} {{ $t('loyalty.points.pointsLabel') }}
    ft-button.button-solid(@click="showCreditModal = true") {{ $t('loyalty.points.credit') }}
  loyalty-points-history.mt-4(:vm="loyaltyVM")
  credit-points-modal(
    v-model="showCreditModal"
    :customer-uuid="customerUuid"
    @credited="onCredited"
  )
</template>

<script lang="ts" setup>
import { customerFormGetVM } from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { customerLoyaltyVM } from '@adapters/primary/view-models/loyalty/customer-loyalty-vm/customerLoyaltyVM'
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { creditManualPoints } from '@core/usecases/loyalty/credit-manual-points/creditManualPoints'
import { getCustomerLoyalty } from '@core/usecases/loyalty/get-customer-loyalty/getCustomerLoyalty'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { getCustomerTickets } from '@core/usecases/support/getCustomerTickets'
import { useCustomerGateway } from '../../../../../../../gateways/customerGateway'
import { useLoyaltyGateway } from '../../../../../../../gateways/loyaltyGateway'
import { useSearchGateway } from '../../../../../../../gateways/searchGateway'
import { useTicketGateway } from '../../../../../../../gateways/ticketGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const showCreditModal = ref(false)
const route = useRoute()
const customerUuid = route.params.uuid as string
const router = useRouter()
const routeName = router.currentRoute.value.name as string
const loyaltyGateway = useLoyaltyGateway()

const loyaltyVM = computed(() => customerLoyaltyVM())

onMounted(async () => {
  const searchGateway = useSearchGateway()
  await searchOrders(routeName, { customerUuid }, searchGateway)
  const customerGateway = useCustomerGateway()
  await listCustomers(100, 0, customerGateway)
  await getCustomer(customerUuid, customerGateway)
  const ticketGateway = useTicketGateway()
  await getCustomerTickets(customerUuid, ticketGateway)
  vm.value = customerFormGetVM(routeName)
  try {
    await getCustomerLoyalty(customerUuid, loyaltyGateway)
  } catch (error) {
    console.error('Failed to load loyalty data:', error)
  }
})

const ordersVM = computed(() => {
  return getOrdersVM(routeName)
})

const edit = () => {
  router.push(`/customers/edit/${customerUuid}`)
}

const onCredited = async (data: { points: number; reason: string }) => {
  await creditManualPoints(
    customerUuid,
    data.points,
    data.reason,
    loyaltyGateway
  )
}
</script>
