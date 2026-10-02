<template lang="pug">
.section
  UButton.mb-4(
    color="gray"
    variant="ghost"
    icon="i-heroicons-arrow-left"
    :label="$t('carts.detail.back')"
    @click="navigateTo('/customers/carts')"
  )

  div(v-if="vm.isLoading")
    USkeleton.h-8.w-64.mb-6
    .grid.gap-6(class="lg:grid-cols-3")
      USkeleton.h-96.w-full(class="lg:col-span-2")
      USkeleton.h-64.w-full

  div(v-else-if="cart")
    .flex.items-start.justify-between.gap-6.mb-6(class="flex-col lg:flex-row")
      div
        .flex.items-center.gap-3
          h1.text-title {{ $t(cart.titleKey, cart.titleParams) }}
          UBadge(v-if="cart.status" :color="cart.status.color" variant="soft") {{ $t(cart.status.labelKey) }}
        p.text-sm.text-gray-500.mt-1 {{ $t('carts.detail.lastActivity', { date: cart.lastActivity }) }}
        .flex.flex-wrap.items-center.gap-x-4.gap-y-1.text-sm.mt-2
          NuxtLink.text-link.underline-offset-2(
            v-if="cart.customerLink"
            class="hover:underline"
            :to="cart.customerLink"
          ) {{ $t('carts.detail.customerLink') }}
          template(v-if="cart.contact")
            span {{ cart.contact.email }}
            span {{ cart.contact.phone }}
          span.text-gray-500(v-if="cart.isAnonymous") {{ $t('carts.detail.anonymous') }}
      div.flex.gap-3.shrink-0
        UButton(
          v-if="cart.orderLink"
          color="primary"
          icon="i-heroicons-document-text"
          :label="$t('carts.detail.viewOrder')"
          :to="cart.orderLink"
        )
        UButton(
          v-else-if="cart.convertLink"
          color="primary"
          icon="i-heroicons-shopping-bag"
          :label="$t('customers.cart.convert')"
          :to="cart.convertLink"
        )

    .grid.gap-6(class="lg:grid-cols-3")
      UCard(class="lg:col-span-2")
        cart-lines-and-totals(:vm="cart")

      .space-y-6
        UCard(v-if="cart.readiness.length > 0")
          template(#header)
            h2.font-semibold {{ $t('carts.detail.readinessTitle') }}
          ul.space-y-2.text-sm
            li.flex.items-center.gap-2(v-for="step in cart.readiness" :key="step.labelKey")
              UIcon.shrink-0(
                :name="step.done ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="step.done ? 'text-green-600' : 'text-amber-600'"
              )
              span {{ $t(step.labelKey) }}

        UCard(v-if="cart.customerUuid || cart.promotionCode || cart.voucher")
          template(#header)
            h2.font-semibold {{ $t('carts.detail.codesTitle') }}
          cart-codes-editor(:vm="cart" @outdated="load")

        UCard(v-if="cart.deliveryAddress || cart.pickupName")
          template(#header)
            h2.font-semibold {{ $t('carts.detail.deliveryTitle') }}
          p.text-sm.font-medium.mb-2(v-if="cart.pickupName") {{ $t('carts.detail.pickupPoint', { name: cart.pickupName }) }}
          address.text-sm.not-italic(v-if="cart.deliveryAddress")
            div(v-for="line in cart.deliveryAddress" :key="line") {{ line }}

        UCard(v-if="cart.customerMessage")
          template(#header)
            h2.font-semibold {{ $t('customers.cart.customerMessage') }}
          p.text-sm.text-gray-700.whitespace-pre-line {{ cart.customerMessage }}

        UCard(v-if="cart.activity.length > 0")
          template(#header)
            h2.font-semibold {{ $t('customers.cart.activityTitle') }}
          cart-activity-list(:activity="cart.activity")
</template>

<script lang="ts" setup>
import type { CartDetailContentVM } from '@adapters/primary/view-models/carts/get-cart-detail/getCartDetailVM'
import { getCartDetailVM } from '@adapters/primary/view-models/carts/get-cart-detail/getCartDetailVM'
import { CartDoesNotExistsError } from '@core/errors/CartDoesNotExistsError'
import { getCartDetail } from '@core/usecases/carts/cart-detail/getCartDetail'
import { useCartGateway } from '../../../../../../../gateways/cartGateway'

definePageMeta({ layout: 'main' })

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const cartUuid = route.params.uuid as string

const vm = computed(() => getCartDetailVM())
const cart = computed((): CartDetailContentVM | undefined => vm.value.cart)

const load = async () => {
  try {
    await getCartDetail(cartUuid, useCartGateway())
  } catch (error: unknown) {
    handleLoadError(error)
  }
}

onMounted(load)

const handleLoadError = (error: unknown) => {
  const toast = useToast()
  if (error instanceof CartDoesNotExistsError) {
    toast.add({ title: t('carts.detail.notFound'), color: 'red' })
    router.replace('/customers/carts')
    return
  }
  toast.add({ title: t('carts.detail.loadError'), color: 'red' })
}
</script>
