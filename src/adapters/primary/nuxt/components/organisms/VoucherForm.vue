<template lang="pug">
div(v-if="!vm")
  .space-y-6
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-4.bg-gray-200.rounded.animate-pulse.mb-2(class='w-1/4')
      .h-10.bg-gray-200.rounded.animate-pulse
    .pb-4
      .h-20.bg-gray-200.rounded.animate-pulse
UForm(v-else :state="vm")
  UFormGroup.pb-4(:label="$t('voucher.fields.customer')" name="customer")
    customer-search-select(
      v-if="vm.get('customer').canEdit"
      :selected-customer="vm.getCustomer()"
      :namespace="customerNamespace"
      @selected="customerSelected"
      @change="customerCleared"
    )
    .font-medium(v-else) {{ vm.getCustomerLabel() }}
  UFormGroup.pb-4(:label="$t('voucher.fields.code')" name="code")
    ft-text-field(
      :model-value="vm.get('code').value"
      :disabled="!vm.get('code').canEdit"
      @update:model-value="codeChanged"
    )
  UFormGroup.pb-4(:label="$t('voucher.fields.amount')" name="amount")
    ft-currency-input(
      :model-value="vm.get('amount').value"
      :disabled="!vm.get('amount').canEdit"
      @update:model-value="amountChanged"
    )
  UFormGroup.pb-4(:label="$t('voucher.fields.expirationDate')" name="expirationDate")
    UPopover(v-if="vm.get('expirationDate').canEdit" :popper="{ placement: 'bottom-start' }")
      UButton(
        icon="i-heroicons-calendar-days-20-solid"
        :label="vm.getExpirationDateLabel() || $t('voucher.selectExpirationDate')"
      )
        template(#trailing)
          UButton(
            v-show="vm.getExpirationDateLabel()"
            color="white"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            :aria-label="$t('voucher.clearExpirationDate')"
            @click.stop.prevent="expirationDateCleared"
          )
      template(#panel="{ close }")
        ft-date-picker(
          :model-value="vm.get('expirationDate').value"
          :min-date="vm.getMinExpirationDate()"
          :is-end-date="true"
          @update:model-value="expirationDateChanged"
          @close="close"
        )
    .font-medium(v-else) {{ vm.getExpirationDateLabel() || $t('voucher.noExpirationDate') }}
  UFormGroup.pb-4(v-if="status" :label="$t('voucher.fields.status')" name="status")
    .font-medium {{ $t(status.key, status.params ?? {}) }}

  div.flex.flex-col.items-end.gap-2.mt-4(v-if="vm.getDisplayValidate()")
    ft-button.button-solid.px-6.text-xl(
      :disabled="!vm.getCanValidate()"
      :loading="vm.isSaving()"
      @click.prevent="validate"
    ) {{ $t('voucher.validate') }}
    ul.text-sm.text-gray-600(v-if="vm.getValidationHints().length > 0")
      li(v-for="hint in vm.getValidationHints()" :key="hint") {{ $t(hint) }}
</template>

<script lang="ts" setup>
import { VOUCHER_CUSTOMER_SEARCH_NAMESPACE } from '@adapters/primary/view-models/vouchers/voucher-form/voucherFormCreateVM'
import type { VoucherStatusVM } from '@adapters/primary/view-models/vouchers/voucher-form/voucherFormGetVM'
import type { VoucherFormVM } from '@adapters/primary/view-models/vouchers/voucher-form/voucherFormVM'

const props = defineProps<{
  vm?: VoucherFormVM
  status?: VoucherStatusVM
}>()

const emit = defineEmits<{
  (e: 'validate'): void
}>()

const customerNamespace = VOUCHER_CUSTOMER_SEARCH_NAMESPACE

const customerSelected = (customerUuid: string) => {
  props.vm?.set('customerUuid', customerUuid)
}

const customerCleared = () => {
  props.vm?.set('customer', undefined)
}

const codeChanged = (value: string) => {
  props.vm?.set('code', value)
}

const amountChanged = (value: number) => {
  props.vm?.set('amount', value)
}

const expirationDateChanged = (value: number) => {
  props.vm?.set('expirationDate', value)
}

const expirationDateCleared = () => {
  props.vm?.set('expirationDate', undefined)
}

const validate = () => {
  if (!props.vm?.getCanValidate()) {
    return
  }
  emit('validate')
}
</script>
