<template lang="pug">
UCard
  template(#header)
    .flex.items-center.justify-between.gap-4
      div
        h2.text-lg.font-semibold {{ $t('customers.cart.title') }}
        p.text-sm.text-gray-500(v-if="vm && vm.hasLines")
          | {{ $t('customers.cart.summary', { count: vm.totalQuantity, date: vm.lastActivity }) }}
      .flex.items-center.gap-2(v-if="vm")
        UButton(
          v-if="vm.cartLink"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-top-right-on-square"
          :label="$t('customers.cart.open')"
          :to="vm.cartLink"
        )
        UButton(
          color="primary"
          icon="i-heroicons-shopping-bag"
          :label="$t('customers.cart.convert')"
          :disabled="!vm.convertLink"
          :to="vm.convertLink"
        )

  div(v-if="!vm")
    USkeleton.h-24.w-full

  div(v-else)
    cart-lines-and-totals(:vm="vm")

    .mt-6
      cart-codes-editor(:vm="vm" @outdated="refresh")

    div.mt-6(v-if="vm.customerMessage")
      h3.text-sm.font-medium.mb-1 {{ $t('customers.cart.customerMessage') }}
      p.text-sm.text-gray-700.whitespace-pre-line {{ vm.customerMessage }}

    div.mt-6(v-if="vm.hasLines && vm.missingKeys.length > 0")
      h3.text-sm.font-medium.mb-1 {{ $t('customers.cart.missingTitle') }}
      ul.list-disc.list-inside.text-sm.text-amber-700
        li(v-for="missingKey in vm.missingKeys" :key="missingKey") {{ $t(missingKey) }}

    div.mt-6(v-if="vm.activity.length > 0")
      h3.text-sm.font-medium.mb-2 {{ $t('customers.cart.activityTitle') }}
      cart-activity-list(:activity="vm.activity")
</template>

<script lang="ts" setup>
import type { CartDetailContentVM } from '@adapters/primary/view-models/carts/get-cart-detail/getCartDetailVM'
import { getCartDetailVM } from '@adapters/primary/view-models/carts/get-cart-detail/getCartDetailVM'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { useCustomerGateway } from '../../../../../../gateways/customerGateway'

const props = defineProps<{ customerUuid: string }>()

const vm = computed(
  (): CartDetailContentVM | undefined => getCartDetailVM().cart
)

const refresh = () => getCustomer(props.customerUuid, useCustomerGateway())
</script>
