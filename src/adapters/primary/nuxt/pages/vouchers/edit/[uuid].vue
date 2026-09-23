<template lang="pug">
.section
  h1.text-title {{ $t('voucher.editTitle') }}
  voucher-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { useVoucherErrorToast } from '@adapters/primary/nuxt/composables/useVoucherErrorToast'
import {
  type VoucherFormEditVM,
  voucherFormEditVM
} from '@adapters/primary/view-models/vouchers/voucher-form/voucherFormEditVM'
import { getVoucher } from '@core/usecases/vouchers/get-voucher/getVoucher'
import { editVoucher } from '@core/usecases/vouchers/voucher-edition/editVoucher'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'
import { useVoucherGateway } from '../../../../../../../gateways/voucherGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const route = useRoute()
const routeName = String(router.currentRoute.value.name ?? '')
const uuid = String(route.params.uuid)
const vm = shallowRef<VoucherFormEditVM>()
const { showVoucherError, showVoucherSuccess } = useVoucherErrorToast()

onMounted(async () => {
  try {
    await getVoucher(uuid, useVoucherGateway())
  } catch (error) {
    showVoucherError(error)
    router.replace('/vouchers/')
    return
  }
  const editVM = voucherFormEditVM(routeName, useDateProvider())
  if (!editVM.canBeChanged()) {
    router.replace(`/vouchers/get/${uuid}`)
    return
  }
  vm.value = editVM
})

const validate = async () => {
  if (!vm.value?.getCanValidate()) {
    return
  }
  try {
    await editVoucher(uuid, vm.value.getEditDto(), useVoucherGateway())
    showVoucherSuccess('voucher.editSuccess')
    router.push(`/vouchers/get/${uuid}`)
  } catch (error) {
    showVoucherError(error)
  }
}
</script>
