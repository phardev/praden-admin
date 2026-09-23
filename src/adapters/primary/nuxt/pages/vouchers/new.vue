<template lang="pug">
.section
  h1.text-title {{ $t('voucher.createTitle') }}
  voucher-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useVoucherErrorToast } from '@adapters/primary/nuxt/composables/useVoucherErrorToast'
import {
  type VoucherFormCreateVM,
  voucherFormCreateVM
} from '@adapters/primary/view-models/vouchers/voucher-form/voucherFormCreateVM'
import { createVoucher } from '@core/usecases/vouchers/voucher-creation/createVoucher'
import { suggestVoucherCode } from '@core/usecases/vouchers/voucher-creation/suggestVoucherCode'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useVoucherGateway } from '../../../../../../gateways/voucherGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')
const vm = shallowRef<VoucherFormCreateVM>()
const { showVoucherError, showVoucherSuccess } = useVoucherErrorToast()

onMounted(async () => {
  try {
    await suggestVoucherCode(useVoucherGateway())
  } catch (error) {
    showVoucherError(error)
  }
  vm.value = voucherFormCreateVM(routeName, useDateProvider())
})

const validate = async () => {
  if (!vm.value?.getCanValidate()) {
    return
  }
  try {
    await createVoucher(vm.value.getDto(), useVoucherGateway())
    showVoucherSuccess('voucher.createSuccess')
    router.push('/vouchers/')
  } catch (error) {
    showVoucherError(error)
  }
}
</script>
