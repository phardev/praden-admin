<template lang="pug">
.grid.gap-4(class="md:grid-cols-2")
  div
    h3.text-sm.font-medium.mb-2 {{ $t('customers.cart.promotionCode.title') }}
    div(v-if="vm.promotionCode")
      .flex.items-center.gap-2
        UBadge(:color="vm.promotionCode.badgeColor") {{ vm.promotionCode.code }}
        UButton(
          v-if="vm.customerUuid"
          color="gray"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          :label="$t('customers.cart.remove')"
          :loading="vm.pendingAction === CartAction.RemovePromotionCode"
          :disabled="vm.isUpdating"
          @click="removePromotionCode"
        )
      p.text-sm.mt-1(:class="vm.promotionCode.messageClass")
        | {{ $t(vm.promotionCode.messageKey, vm.promotionCode.messageParams) }}
    form.flex.gap-2(v-else-if="vm.customerUuid" @submit.prevent="applyPromotionCode")
      UInput.flex-1(
        v-model="promotionCodeInput"
        :placeholder="$t('customers.cart.promotionCode.placeholder')"
        :disabled="!vm.canEditCodes"
      )
      UButton(
        type="submit"
        :label="$t('customers.cart.apply')"
        :loading="vm.pendingAction === CartAction.ApplyPromotionCode"
        :disabled="!vm.canEditCodes || !promotionCodeInput.trim()"
      )
    p.text-sm.text-gray-500(v-else) {{ $t('customers.cart.noCode') }}

  div
    h3.text-sm.font-medium.mb-2 {{ $t('customers.cart.voucher.title') }}
    div(v-if="vm.voucher")
      .flex.items-center.gap-2
        UBadge(:color="vm.voucher.badgeColor") {{ vm.voucher.code }}
        UButton(
          v-if="vm.customerUuid"
          color="gray"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark"
          :label="$t('customers.cart.remove')"
          :loading="vm.pendingAction === CartAction.RemoveVoucher"
          :disabled="vm.isUpdating"
          @click="removeVoucher"
        )
      p.text-sm.mt-1(:class="vm.voucher.messageClass")
        | {{ $t(vm.voucher.messageKey, vm.voucher.messageParams) }}
    form.flex.gap-2(v-else-if="vm.customerUuid" @submit.prevent="applyVoucher")
      UInput.flex-1(
        v-model="voucherInput"
        :placeholder="$t('customers.cart.voucher.placeholder')"
        :disabled="!vm.canEditCodes"
      )
      UButton(
        type="submit"
        :label="$t('customers.cart.apply')"
        :loading="vm.pendingAction === CartAction.ApplyVoucher"
        :disabled="!vm.canEditCodes || !voucherInput.trim()"
      )
    p.text-sm.text-gray-500(v-else) {{ $t('customers.cart.noCode') }}
</template>

<script lang="ts" setup>
import { cartErrorMessageVM } from '@adapters/primary/view-models/carts/cart-error/cartErrorMessageVM'
import type { CartDetailContentVM } from '@adapters/primary/view-models/carts/get-cart-detail/getCartDetailVM'
import { CartAction } from '@core/entities/cart'
import { applyPromotionCodeToCustomerCart } from '@core/usecases/carts/promotion-code-application/applyPromotionCodeToCustomerCart'
import { removePromotionCodeFromCustomerCart } from '@core/usecases/carts/promotion-code-removal/removePromotionCodeFromCustomerCart'
import { applyVoucherToCustomerCart } from '@core/usecases/carts/voucher-application/applyVoucherToCustomerCart'
import { removeVoucherFromCustomerCart } from '@core/usecases/carts/voucher-removal/removeVoucherFromCustomerCart'
import { useCartGateway } from '../../../../../../gateways/cartGateway'

const props = defineProps<{ vm: CartDetailContentVM }>()
const emit = defineEmits<{ (e: 'outdated'): void }>()
const { t } = useI18n()

const promotionCodeInput = ref('')
const voucherInput = ref('')

const customerUuid = (): string => props.vm.customerUuid!

const run = async (change: () => Promise<void>) => {
  try {
    await change()
  } catch (error) {
    const message = cartErrorMessageVM(error)
    useToast().add({ title: t(message.key, message.params), color: 'red' })
    if (message.cartOutdated) {
      emit('outdated')
    }
  }
}

const applyPromotionCode = () =>
  run(async () => {
    await applyPromotionCodeToCustomerCart(
      customerUuid(),
      promotionCodeInput.value.trim(),
      useCartGateway()
    )
    promotionCodeInput.value = ''
  })

const removePromotionCode = () =>
  run(() =>
    removePromotionCodeFromCustomerCart(customerUuid(), useCartGateway())
  )

const applyVoucher = () =>
  run(async () => {
    await applyVoucherToCustomerCart(
      customerUuid(),
      voucherInput.value.trim(),
      useCartGateway()
    )
    voucherInput.value = ''
  })

const removeVoucher = () =>
  run(() => removeVoucherFromCustomerCart(customerUuid(), useCartGateway()))
</script>
