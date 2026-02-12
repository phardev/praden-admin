<template lang="pug">
div
  .space-y-6
    .border.rounded.p-4
      h3.text-lg.font-semibold.mb-3 {{ $t('orders.create.customer') }}
      .grid.grid-cols-2.gap-2.text-sm
        div
          .text-gray-500 {{ $t('orders.create.firstname') }}
          .font-medium {{ customer.firstname }} {{ customer.lastname }}
        div
          .text-gray-500 {{ $t('orders.create.email') }}
          .font-medium {{ customer.email }}
        div
          .text-gray-500 {{ $t('orders.create.phone') }}
          .font-medium {{ customer.phone }}

    .border.rounded.p-4
      h3.text-lg.font-semibold.mb-3 {{ $t('orders.create.deliveryAddress') }}
      .text-sm
        div {{ deliveryAddress.name }}
        div {{ deliveryAddress.address }}
        div {{ deliveryAddress.zip }} {{ deliveryAddress.city }}
        div {{ deliveryAddress.country }}
        div {{ deliveryAddress.phone }}

    .border.rounded.p-4
      h3.text-lg.font-semibold.mb-3 {{ $t('orders.create.billingAddress') }}
      .text-sm
        div {{ billingAddress.name }}
        div {{ billingAddress.address }}
        div {{ billingAddress.zip }} {{ billingAddress.city }}
        div {{ billingAddress.country }}
        div {{ billingAddress.phone }}

    .border.rounded.p-4
      h3.text-lg.font-semibold.mb-3 {{ $t('orders.create.productsStep') }}
      .border.rounded
        .grid.grid-cols-12.gap-2.p-3.bg-gray-50.font-semibold.text-sm
          .col-span-5 {{ $t('orders.create.product') }}
          .col-span-2 {{ $t('orders.create.quantity') }}
          .col-span-2 {{ $t('orders.create.unitPrice') }}
          .col-span-3 {{ $t('orders.create.lineTotal') }}
        .grid.grid-cols-12.gap-2.p-3.text-sm.border-t(
          v-for="(line, index) in lines"
          :key="line.productUuid"
        )
          .col-span-5 {{ line.productName }}
          .col-span-2 {{ line.quantity }}
          .col-span-2 {{ formatCents(line.priceWithoutTax) }}
          .col-span-3 {{ formatCents(currentVM.getLineTotalWithTax(index)) }}

    .border.rounded.p-4(v-if="deliveryMethodName")
      h3.text-lg.font-semibold.mb-3 {{ $t('orders.create.deliveryMethod') }}
      .text-sm {{ deliveryMethodName }}

    .border.rounded.p-4(v-if="promotionCode")
      h3.text-lg.font-semibold.mb-3 {{ $t('orders.create.promotionCode') }}
      .text-sm {{ promotionCode }}

    .flex.justify-between.items-center.p-4.bg-gray-50.rounded.text-lg.font-semibold
      span {{ $t('orders.create.orderTotal') }}
      span {{ formatCents(currentVM.getOrderTotalWithTax()) }}

    .flex.flex-row-reverse
      ft-button.px-6.text-xl(
        @click.prevent="confirm"
      ) {{ $t('orders.create.confirm') }}
</template>

<script lang="ts" setup>
import type { CreateOrderVM } from '@adapters/primary/view-models/orders/create-order/createOrderVM'
import { useDeliveryMethodStore } from '@store/deliveryMethodStore'

const props = defineProps<{
  vm: CreateOrderVM
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const currentVM = toRef(props, 'vm')
const deliveryMethodStore = useDeliveryMethodStore()

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
})

const formatCents = (cents: number): string => {
  return formatter.format(cents / 100)
}

const customer = computed(() => currentVM.value.get('customer'))
const deliveryAddress = computed(() => currentVM.value.get('deliveryAddress'))
const billingAddress = computed(() => {
  if (currentVM.value.get('sameAsDelivery')) {
    return currentVM.value.get('deliveryAddress')
  }
  return currentVM.value.get('billingAddress')
})
const lines = computed(() => currentVM.value.get('lines') || [])
const promotionCode = computed(() => currentVM.value.get('promotionCode'))

const deliveryMethodName = computed(() => {
  const uuid = currentVM.value.get('deliveryMethodUuid')
  if (!uuid) return ''
  const method = deliveryMethodStore.items.find((m) => m.uuid === uuid)
  return method?.name || ''
})

const confirm = () => {
  emit('confirm')
}
</script>
