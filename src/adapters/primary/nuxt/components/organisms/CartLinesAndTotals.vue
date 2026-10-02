<template lang="pug">
div
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
</template>

<script lang="ts" setup>
import type { CartContentVM } from '@adapters/primary/view-models/carts/cart-content/cartContentVM'

defineProps<{ vm: CartContentVM }>()
</script>
