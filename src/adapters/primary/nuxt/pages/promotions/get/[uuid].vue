<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer promotion
  h1.text-title Voir promotion
  promotion-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { promotionFormGetVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormGetVM'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const promotionUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  await getPromotion(promotionUuid, usePromotionGateway())
  vm.value = promotionFormGetVM(routeName)
})

const edit = () => {
  router.push(`/promotions/edit/${promotionUuid}`)
}
</script>
