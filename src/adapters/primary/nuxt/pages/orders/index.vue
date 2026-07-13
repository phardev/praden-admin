<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/orders/new")
      ft-button.button-solid.text-xl.px-6 {{ $t('orders.create.cta') }}
  h1.text-page-title.flex-grow Commandes
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
