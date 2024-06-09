<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer client
  h1.text-title Voir client
  customer-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { useCustomerGateway } from '../../../../../../../gateways/customerGateway'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { customerFormGetVM } from '@adapters/primary/view-models/customers/customer-form/customerFormGetVM'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const customerUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  const customerGateway = useCustomerGateway()
  listCustomers(customerGateway)
  await getCustomer(customerUuid, customerGateway)
  vm.value = customerFormGetVM(routeName)
})

const edit = () => {
  router.push(`/customers/edit/${customerUuid}`)
}
</script>
