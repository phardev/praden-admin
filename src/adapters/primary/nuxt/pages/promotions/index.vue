<template lang="pug">
.section
  promotions-list(:promotions-vm="promotionsVM")
</template>

<script lang="ts" setup>
import { getPromotionsVM } from '@adapters/primary/view-models/get-promotions/getPromotionsVM'
import { useDateProvider } from '../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const promotionsVM = computed(() => {
  return getPromotionsVM(useDateProvider())
})
</script>
