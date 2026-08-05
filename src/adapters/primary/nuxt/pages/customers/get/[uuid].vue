<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse.gap-3
    ft-button.button-solid.text-xl.px-6(@click="edit") {{ $t('customers.editButton') }}
    ft-button.text-xl.px-6(color="red" @click="openDeleteModal") {{ $t('customers.deleteButton') }}
  h1.text-title {{ $t('customers.viewTitle') }}
  customer-form(
    :vm="vm"
  )
  .mt-8
    customer-loyalty-points(:customer-uuid="customerUuid")

  h2.text-subtitle.mt-8 {{ $t('customers.ordersHistory') }}
  orders-list(
    :vm="ordersVM"
    :search-key="routeName"
    :initial-filters="{ customerUuid }"
  )
  h2.text-subtitle.mt-8 {{ $t('customers.supportTickets') }}
  customer-tickets-list(:customer-uuid="customerUuid")

  customer-delete-modal(
    v-model:is-open="isDeleteModalOpen"
    :customer="currentCustomer"
    :is-deleting="isDeleting"
    @close="closeDeleteModal"
    @confirm="handleDelete"
  )
</template>

<script lang="ts" setup>
import { customerFormGetVM } from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'
import { CustomerDoesNotExistsError } from '@core/errors/CustomerDoesNotExistsError'
import { deleteCustomer } from '@core/usecases/customers/customer-deletion/deleteCustomer'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { getCustomerTickets } from '@core/usecases/support/getCustomerTickets'
import { useCustomerStore } from '@store/customerStore'
import { useCustomerGateway } from '../../../../../../../gateways/customerGateway'
import { useTicketGateway } from '../../../../../../../gateways/ticketGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const customerUuid = route.params.uuid as string
const router = useRouter()
const routeName = router.currentRoute.value.name as string
const { t } = useI18n()

const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)

onMounted(async () => {
  try {
    const customerGateway = useCustomerGateway()
    await listCustomers(100, 0, customerGateway)
    await getCustomer(customerUuid, customerGateway)
    const ticketGateway = useTicketGateway()
    await getCustomerTickets(customerUuid, ticketGateway)
    vm.value = customerFormGetVM(routeName)
  } catch (error: unknown) {
    handleLoadError(error)
  }
})

const handleLoadError = (error: unknown) => {
  const toast = useToast()
  if (error instanceof CustomerDoesNotExistsError) {
    toast.add({ title: t('customers.notFound'), color: 'red' })
    router.replace('/customers')
    return
  }
  toast.add({ title: t('error.unknown'), color: 'red' })
}

const ordersVM = computed(() => {
  return getOrdersVM(routeName)
})

const currentCustomer = computed(() => {
  return useCustomerStore().current
})

const edit = () => {
  router.push(`/customers/edit/${customerUuid}`)
}

const openDeleteModal = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const handleDelete = async () => {
  try {
    isDeleting.value = true
    await deleteCustomer(customerUuid, useCustomerGateway())
    closeDeleteModal()
    router.push('/customers')
  } catch {
    const toast = useToast()
    toast.add({
      title: t('error.unknown'),
      color: 'red'
    })
  } finally {
    isDeleting.value = false
  }
}
</script>
