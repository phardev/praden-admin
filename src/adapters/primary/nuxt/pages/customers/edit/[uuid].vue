<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer client
  customer-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { customerFormEditVM } from '@adapters/primary/view-models/customers/customer-form/customerFormEditVM'
import { editCustomer } from '@core/usecases/customers/customer-edition/editCustomer'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { useCustomerGateway } from '../../../../../../../gateways/customerGateway'

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
  vm.value = customerFormEditVM(routeName)
})

const validate = async () => {
  await editCustomer(customerUuid, vm.value.getDto(), useCustomerGateway())
  router.push('/customers/')
}
</script>
