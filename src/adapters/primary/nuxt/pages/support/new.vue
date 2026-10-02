<template lang="pug">
.section
  .flex.items-center.gap-4.mb-6
    UButton(
      icon="i-lucide-arrow-left"
      variant="soft"
      color="primary"
      :aria-label="$t('support.create.back')"
      @click="router.push('/support')"
    )
    h1.text-title {{ $t('support.create.title') }}
  p.text-gray-600.mb-6 {{ $t('support.create.description') }}
  ticket-form(
    :vm="vm"
    @validate="validate"
    @customer-selected="loadCustomerOrders"
    @customer-cleared="forgetCustomerOrders"
  )
</template>

<script lang="ts" setup>
import {
  TICKET_CUSTOMER_SEARCH_NAMESPACE,
  TICKET_ORDERS_SEARCH_NAMESPACE,
  type TicketFormCreateVM,
  ticketFormCreateVM
} from '@adapters/primary/view-models/support/ticket-form/ticketFormCreateVM'
import { searchOrders } from '@core/usecases/order/orders-searching/searchOrders'
import { clearSearch } from '@core/usecases/search/search-clearing/clearSearch'
import { createTicket } from '@core/usecases/support/createTicket'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import { useTicketGateway } from '../../../../../../gateways/ticketGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const { t } = useI18n()
const toast = useToast()
const vm = shallowRef<TicketFormCreateVM>()

onMounted(() => {
  clearSearch(TICKET_CUSTOMER_SEARCH_NAMESPACE)
  clearSearch(TICKET_ORDERS_SEARCH_NAMESPACE)
  vm.value = ticketFormCreateVM(routeName)
})

const loadCustomerOrders = async (customerUuid: string) => {
  try {
    await searchOrders(
      TICKET_ORDERS_SEARCH_NAMESPACE,
      { customerUuid },
      useSearchGateway()
    )
  } catch {
    toast.add({ title: t('support.create.ordersError'), color: 'red' })
  }
}

const forgetCustomerOrders = () => {
  clearSearch(TICKET_ORDERS_SEARCH_NAMESPACE)
}

const validate = async () => {
  if (!vm.value?.getCanValidate()) {
    return
  }
  try {
    await createTicket(vm.value.getDto(), useTicketGateway())
    toast.add({ title: t('support.create.success'), color: 'green' })
    router.push(`/support/${vm.value.getCreatedTicketUuid()}`)
  } catch {
    toast.add({ title: t('support.create.error'), color: 'red' })
  }
}
</script>
