<template lang="pug">
.section
  h1.text-page-title.flex-grow Commandes
  orders-list(:vm="ordersVM")
</template>

<script lang="ts" setup>
import { getOrdersVM } from '@adapters/primary/view-models/orders/get-orders/getOrdersVM'

definePageMeta({ layout: 'main' })

const ordersVM = computed(() => {
  return getOrdersVM()
})
</script>
