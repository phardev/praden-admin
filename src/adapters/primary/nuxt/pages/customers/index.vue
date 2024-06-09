<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/customers/new")
      ft-button.button-solid.text-xl.px-6 Créer client
  ft-table(
    :headers="customersVM.headers"
    :items="customersVM.items"
    @clicked="customerSelected"
  )
    template(#title) Clients
</template>

<script lang="ts" setup>
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'
import { getCustomersVM } from '@adapters/primary/view-models/customers/get-customers/getCustomersVM'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCustomers(useCustomerGateway())
})

const customersVM = computed(() => {
  return getCustomersVM()
})

const customerSelected = (uuid: string) => {
  const router = useRouter()
  router.push(`/customers/get/${uuid}`)
}
</script>
