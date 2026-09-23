<template lang="pug">
.section
  h1.text-title {{ $t('voucher.viewTitle') }}
  voucher-form(:vm="vm" :status="vm?.getStatus()")
  template(v-if="vm")
    .mt-6(v-if="vm.getOrderUuid()")
      nuxt-link.text-colored.underline(:to="`/orders/get/${vm.getOrderUuid()}`") {{ $t('voucher.seeOrder') }}
    .flex.flex-row-reverse.gap-4.mt-6(v-if="vm.canBeChanged()")
      nuxt-link(:to="`/vouchers/edit/${uuid}`")
        ft-button.button-solid.px-6.text-xl {{ $t('voucher.editButton') }}
      ft-button.button-outlined.px-6.text-xl(
        data-testid="voucher-delete"
        @click.prevent="askDeleteConfirmation"
      ) {{ $t('voucher.deleteButton') }}
  ft-modal(v-model="isDeleteModalOpen" @close="closeDeleteModal")
    .space-y-4
      p.text-lg {{ $t('voucher.deleteConfirm') }}
      .flex.flex-row-reverse.gap-4
        ft-button.button-solid.px-6(
          data-testid="voucher-delete-confirm"
          :loading="vm?.isSaving()"
          :disabled="vm?.isSaving()"
          @click.prevent="confirmDelete"
        ) {{ $t('voucher.deleteButton') }}
        ft-button.button-outlined.px-6(
          :disabled="vm?.isSaving()"
          @click.prevent="closeDeleteModal"
        ) {{ $t('common.cancel') }}
</template>

<script lang="ts" setup>
import { useVoucherErrorToast } from '@adapters/primary/nuxt/composables/useVoucherErrorToast'
import {
  type VoucherFormGetVM,
  voucherFormGetVM
} from '@adapters/primary/view-models/vouchers/voucher-form/voucherFormGetVM'
import { getVoucher } from '@core/usecases/vouchers/get-voucher/getVoucher'
import { deleteVoucher } from '@core/usecases/vouchers/voucher-deletion/deleteVoucher'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'
import { useVoucherGateway } from '../../../../../../../gateways/voucherGateway'

definePageMeta({ layout: 'main' })

const router = useRouter()
const route = useRoute()
const routeName = String(router.currentRoute.value.name ?? '')
const uuid = String(route.params.uuid)
const vm = shallowRef<VoucherFormGetVM>()
const isDeleteModalOpen = ref(false)
const { showVoucherError, showVoucherSuccess } = useVoucherErrorToast()

onMounted(async () => {
  try {
    await getVoucher(uuid, useVoucherGateway())
    vm.value = voucherFormGetVM(routeName, useDateProvider())
  } catch (error) {
    showVoucherError(error)
    router.replace('/vouchers/')
  }
})

const askDeleteConfirmation = () => {
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const confirmDelete = async () => {
  if (!vm.value || vm.value.isSaving()) {
    return
  }
  try {
    await deleteVoucher(uuid, useVoucherGateway())
    showVoucherSuccess('voucher.deleteSuccess')
    isDeleteModalOpen.value = false
    router.push('/vouchers/')
  } catch (error) {
    isDeleteModalOpen.value = false
    showVoucherError(error)
  }
}
</script>
