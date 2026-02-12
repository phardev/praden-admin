<template lang="pug">
.section
  .flex.items-center.justify-between.mb-4
    h1.text-page-title.flex-grow Commandes
    nuxt-link(to="/orders/new")
      ft-button {{ $t('orders.createOrder') }}
  orders-list(:vm="ordersVM" :search-key="routeName")
</template>

<script lang="ts" setup>
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')

const ordersVM = computed(() => {
  return getOrdersVM(routeName)
})
</script>
