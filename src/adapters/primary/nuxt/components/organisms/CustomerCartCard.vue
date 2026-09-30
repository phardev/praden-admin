<template lang="pug">
UCard
  template(#header)
    .flex.items-center.justify-between.gap-4
      div
        h2.text-lg.font-semibold {{ $t('customers.cart.title') }}
        p.text-sm.text-gray-500(v-if="vm && vm.hasLines")
          | {{ $t('customers.cart.summary', { count: vm.totalQuantity, date: vm.lastActivity }) }}
      UButton(
        v-if="vm"
        color="primary"
        icon="i-heroicons-shopping-bag"
        :label="$t('customers.cart.convert')"
        :disabled="!vm.canConvert"
        @click="convert"
      )

  div(v-if="!vm")
    USkeleton.h-24.w-full

  div(v-else)
    .text-center.py-8(v-if="!vm.hasLines")
      UIcon.text-gray-400(name="i-heroicons-shopping-cart" size="48")
      p.text-sm.text-gray-500.mt-2 {{ $t('customers.cart.empty') }}

    div(v-else)
      ul.divide-y.divide-gray-100
        li.py-3.flex.items-start.justify-between.gap-4(
          v-for="line in vm.lines"
          :key="line.productUuid"
        )
          div
            p.font-medium {{ line.name }}
            p.text-sm.text-gray-500
              | {{ $t('customers.cart.lineQuantity', { quantity: line.quantity, price: line.unitPrice }) }}
              span.line-through.ml-2(v-if="line.unitPriceBeforePromotion") {{ line.unitPriceBeforePromotion }}
            p.text-sm.text-red-600(
              v-for="alertKey in line.alertKeys"
              :key="alertKey"
            ) {{ $t(alertKey) }}
          p.font-medium.whitespace-nowrap {{ line.total }}

      dl.mt-4.space-y-1.text-sm
        .flex.justify-between
          dt {{ $t('customers.cart.totals.products') }}
          dd {{ vm.totals.products }}
        .flex.justify-between(v-if="vm.totals.delivery")
          dt {{ $t('customers.cart.totals.delivery') }}
          dd {{ vm.totals.delivery }}
        .flex.justify-between.text-green-700(v-if="vm.totals.promotionCodeDiscount")
          dt {{ $t('customers.cart.totals.promotionCodeDiscount') }}
          dd - {{ vm.totals.promotionCodeDiscount }}
        .flex.justify-between.text-green-700(v-if="vm.totals.voucherDiscount")
          dt {{ $t('customers.cart.totals.voucherDiscount') }}
          dd - {{ vm.totals.voucherDiscount }}
        .flex.justify-between.font-semibold.text-base
          dt {{ $t('customers.cart.totals.total') }}
          dd {{ vm.totals.total }}

    .grid.gap-4.mt-6(class="md:grid-cols-2")
      div
        h3.text-sm.font-medium.mb-2 {{ $t('customers.cart.promotionCode.title') }}
        div(v-if="vm.promotionCode")
          .flex.items-center.gap-2
            UBadge(:color="vm.promotionCode.badgeColor") {{ vm.promotionCode.code }}
            UButton(
              color="gray"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              :label="$t('customers.cart.remove')"
              :loading="vm.pendingAction === CustomerCartAction.RemovePromotionCode"
              :disabled="vm.isUpdating"
              @click="removePromotionCode"
            )
          p.text-sm.mt-1(:class="vm.promotionCode.messageClass")
            | {{ $t(vm.promotionCode.messageKey, vm.promotionCode.messageParams) }}
        form.flex.gap-2(v-else @submit.prevent="applyPromotionCode")
          UInput.flex-1(
            v-model="promotionCodeInput"
            :placeholder="$t('customers.cart.promotionCode.placeholder')"
            :disabled="!vm.canEditCodes"
          )
          UButton(
            type="submit"
            :label="$t('customers.cart.apply')"
            :loading="vm.pendingAction === CustomerCartAction.ApplyPromotionCode"
            :disabled="!vm.canEditCodes || !promotionCodeInput.trim()"
          )

      div
        h3.text-sm.font-medium.mb-2 {{ $t('customers.cart.voucher.title') }}
        div(v-if="vm.voucher")
          .flex.items-center.gap-2
            UBadge(:color="vm.voucher.badgeColor") {{ vm.voucher.code }}
            UButton(
              color="gray"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              :label="$t('customers.cart.remove')"
              :loading="vm.pendingAction === CustomerCartAction.RemoveVoucher"
              :disabled="vm.isUpdating"
              @click="removeVoucher"
            )
          p.text-sm.mt-1(:class="vm.voucher.messageClass")
            | {{ $t(vm.voucher.messageKey, vm.voucher.messageParams) }}
        form.flex.gap-2(v-else @submit.prevent="applyVoucher")
          UInput.flex-1(
            v-model="voucherInput"
            :placeholder="$t('customers.cart.voucher.placeholder')"
            :disabled="!vm.canEditCodes"
          )
          UButton(
            type="submit"
            :label="$t('customers.cart.apply')"
            :loading="vm.pendingAction === CustomerCartAction.ApplyVoucher"
            :disabled="!vm.canEditCodes || !voucherInput.trim()"
          )

    div.mt-6(v-if="vm.customerMessage")
      h3.text-sm.font-medium.mb-1 {{ $t('customers.cart.customerMessage') }}
      p.text-sm.text-gray-700.whitespace-pre-line {{ vm.customerMessage }}

    div.mt-6(v-if="vm.hasLines && vm.missingKeys.length > 0")
      h3.text-sm.font-medium.mb-1 {{ $t('customers.cart.missingTitle') }}
      ul.list-disc.list-inside.text-sm.text-amber-700
        li(v-for="missingKey in vm.missingKeys" :key="missingKey") {{ $t(missingKey) }}

    div.mt-6(v-if="vm.activity.length > 0")
      h3.text-sm.font-medium.mb-2 {{ $t('customers.cart.activityTitle') }}
      ul.space-y-1.text-sm
        li.flex.gap-2(v-for="(activity, index) in vm.activity" :key="index")
          span.text-gray-500.whitespace-nowrap {{ activity.date }}
          span.text-gray-500 {{ $t(activity.actorKey) }}
          span {{ $t(activity.labelKey, activity.labelParams) }}
</template>

<script lang="ts" setup>
import type { CustomerCartVM } from '@adapters/primary/view-models/customers/get-customer-cart/getCustomerCartVM'
import { getCustomerCartVM } from '@adapters/primary/view-models/customers/get-customer-cart/getCustomerCartVM'
import { CustomerCartAction } from '@core/entities/cart'
import { applyPromotionCodeToCustomerCart } from '@core/usecases/carts/promotion-code-application/applyPromotionCodeToCustomerCart'
import { removePromotionCodeFromCustomerCart } from '@core/usecases/carts/promotion-code-removal/removePromotionCodeFromCustomerCart'
import { applyVoucherToCustomerCart } from '@core/usecases/carts/voucher-application/applyVoucherToCustomerCart'
import { removeVoucherFromCustomerCart } from '@core/usecases/carts/voucher-removal/removeVoucherFromCustomerCart'
import { useCartGateway } from '../../../../../../gateways/cartGateway'

const props = defineProps<{ customerUuid: string }>()
const { t } = useI18n()
const router = useRouter()

const promotionCodeInput = ref('')
const voucherInput = ref('')

const vm = computed((): CustomerCartVM | undefined => getCustomerCartVM())

const run = async (change: () => Promise<void>) => {
  try {
    await change()
  } catch {
    useToast().add({ title: t('customers.cart.error'), color: 'red' })
  }
}

const applyPromotionCode = () =>
  run(async () => {
    await applyPromotionCodeToCustomerCart(
      props.customerUuid,
      promotionCodeInput.value.trim(),
      useCartGateway()
    )
    promotionCodeInput.value = ''
  })

const removePromotionCode = () =>
  run(() =>
    removePromotionCodeFromCustomerCart(props.customerUuid, useCartGateway())
  )

const applyVoucher = () =>
  run(async () => {
    await applyVoucherToCustomerCart(
      props.customerUuid,
      voucherInput.value.trim(),
      useCartGateway()
    )
    voucherInput.value = ''
  })

const removeVoucher = () =>
  run(() => removeVoucherFromCustomerCart(props.customerUuid, useCartGateway()))

const convert = () => {
  router.push({ path: '/orders/new', query: { customer: props.customerUuid } })
}
</script>
