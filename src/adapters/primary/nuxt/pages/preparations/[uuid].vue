<template lang="pug">
.section
  h1.text-4xl.font-semibold.text-default Commande \#{{ preparationVM.reference }}
  fv-table(
    :headers="preparationVM.headers"
    :items="preparationVM.lines"
  )
</template>

<script lang="ts" setup>
import { definePageMeta } from '../../../../../../.nuxt/imports'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getPreparation } from '@core/usecases/order/get-preparation/getPreparation'
import { getPreparationVM } from '@adapters/primary/view-models/get-preparation/getPreparationVM'

definePageMeta({ layout: 'main' })

const route = useRoute()
const preparationUuid = route.params.uuid

onMounted(() => {
  getPreparation(preparationUuid, useOrderGateway())
})

const preparationVM = computed(() => {
  return getPreparationVM()
})
</script>
