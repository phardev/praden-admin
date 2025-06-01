<template lang="pug">
  .section
    nuxt-link.flex.flex-row-reverse(to="/promotion-codes/new")
      ft-button.button-solid.text-xl.px-6 Créer code promotion
    promotion-codes-list(:promotion-codes-vm="promotionCodesVM")
</template>

<script lang="ts" setup>
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { listPromotionCodes } from '@core/usecases/promotion-codes/promotion-code-listing/listPromotionCodes'
import { usePromotionCodeGateway } from '../../../../../../gateways/promotionCodeGateway'
import { getPromotionCodesVM } from '@adapters/primary/view-models/promotion-codes/get-promotion-codes-vm/getPromotionCodesVM'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listPromotionCodes(usePromotionCodeGateway())
})

const promotionCodesVM = computed(() => {
  return getPromotionCodesVM(useDateProvider())
})
</script>
