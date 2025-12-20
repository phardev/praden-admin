<template lang="pug">
.section
  h1.text-page-title.flex-grow Commandes
  orders-list(:vm="ordersVM" :search-key="routeName")
</template>

<script lang="ts" setup>
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'

definePageMeta({ layout: 'main' })

const router = useRouter()
const routeName = router.currentRoute.value.name

const ordersVM = computed(() => {
  return getOrdersVM(String(routeName))
})
</script>
