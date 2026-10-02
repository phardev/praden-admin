<template lang="pug">
.section
  h1.text-title {{ $t('welcomeCode.createTitle') }}
  welcome-code-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useDiscountCodeErrorToast } from '@adapters/primary/nuxt/composables/useDiscountCodeErrorToast'
import {
  type WelcomeCodeFormVM,
  welcomeCodeFormCreateVM
} from '@adapters/primary/view-models/welcome-codes/welcome-code-form/welcomeCodeFormVM'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { createWelcomeCode } from '@core/usecases/welcome-codes/welcome-code-creation/createWelcomeCode'
import { useDeliveryMethodGateway } from '../../../../../../gateways/deliveryMethodGateway'
import { useWelcomeCodeGateway } from '../../../../../../gateways/welcomeCodeGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const vm = shallowRef<WelcomeCodeFormVM>()
const { showDiscountCodeError, showDiscountCodeSuccess } =
  useDiscountCodeErrorToast()

onMounted(() => {
  listDeliveryMethods(useDeliveryMethodGateway())
  vm.value = welcomeCodeFormCreateVM(routeName)
})

const validate = async () => {
  if (!vm.value?.getCanValidate()) {
    return
  }
  try {
    await createWelcomeCode(vm.value.getDto(), useWelcomeCodeGateway())
    showDiscountCodeSuccess('welcomeCode.createSuccess')
    router.push('/welcome-codes/')
  } catch (error) {
    showDiscountCodeError(error)
  }
}
</script>
