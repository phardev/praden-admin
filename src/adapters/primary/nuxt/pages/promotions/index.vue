<template lang="pug">
.section
  nuxt-link.flex.flex-row-reverse(to="/promotions/new")
    ft-button.button-solid.text-xl.px-6 Créer promotion
  promotions-list(:promotions-vm="promotionsVM")
</template>

<script lang="ts" setup>
import { getPromotionsVM } from '@adapters/primary/view-models/get-promotions/getPromotionsVM'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { listPromotions } from '@core/usecases/promotions/promotions-listing/listPromotions'
import { usePromotionGateway } from '../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listPromotions(usePromotionGateway())
})

const promotionsVM = computed(() => {
  return getPromotionsVM(useDateProvider())
})
</script>
