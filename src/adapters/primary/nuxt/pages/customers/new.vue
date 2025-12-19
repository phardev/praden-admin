<template lang="pug">
.section
  h1.text-title Créer nouveau client
  customer-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { customerFormCreateVM } from '@adapters/primary/view-models/customers/customer-form/customerFormCreateVM'
import { createCustomer } from '@core/usecases/customers/customer-creation/createCustomer'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = router.currentRoute.value.name as string
const vm = ref(customerFormCreateVM(routeName))

const validate = async () => {
  await createCustomer(vm.value.getDto(), useCustomerGateway())
  router.push('/customers/')
}
</script>
