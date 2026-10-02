<template lang="pug">
.section
  h1.text-title {{ $t('welcomeCode.editTitle') }}
  welcome-code-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useDiscountCodeErrorToast } from '@adapters/primary/nuxt/composables/useDiscountCodeErrorToast'
import {
  type WelcomeCodeFormVM,
  welcomeCodeFormEditVM
} from '@adapters/primary/view-models/welcome-codes/welcome-code-form/welcomeCodeFormVM'
import { listDeliveryMethods } from '@core/usecases/delivery-methods/delivery-method-listing/listDeliveryMethods'
import { editWelcomeCode } from '@core/usecases/welcome-codes/welcome-code-edition/editWelcomeCode'
import { listWelcomeCodes } from '@core/usecases/welcome-codes/welcome-codes-listing/listWelcomeCodes'
import { useDeliveryMethodGateway } from '../../../../../../../gateways/deliveryMethodGateway'
import { useWelcomeCodeGateway } from '../../../../../../../gateways/welcomeCodeGateway'

definePageMeta({ layout: 'main' })

const route = useRoute()
const router = useRouter()
const welcomeCodeUuid = String(route.params.uuid)
const routeName = String(router.currentRoute.value.name ?? '')
const vm = shallowRef<WelcomeCodeFormVM>()
const { showDiscountCodeError, showDiscountCodeSuccess } =
  useDiscountCodeErrorToast()

onMounted(async () => {
  listDeliveryMethods(useDeliveryMethodGateway())
  try {
    await listWelcomeCodes(useWelcomeCodeGateway())
  } catch (error) {
    showDiscountCodeError(error)
    return
  }
  const editVM = welcomeCodeFormEditVM(routeName, welcomeCodeUuid)
  if (!editVM.isReady()) {
    showDiscountCodeError({ code: 'WELCOME_CODE_NOT_FOUND' })
    router.push('/welcome-codes/')
    return
  }
  vm.value = editVM
})

const validate = async () => {
  if (!vm.value?.getCanValidate()) {
    return
  }
  try {
    await editWelcomeCode(
      welcomeCodeUuid,
      vm.value.getDto(),
      useWelcomeCodeGateway()
    )
    showDiscountCodeSuccess('welcomeCode.editSuccess')
    router.push('/welcome-codes/')
  } catch (error) {
    showDiscountCodeError(error)
  }
}
</script>
