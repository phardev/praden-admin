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
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { getPromotionVM } from '@adapters/primary/view-models/promotions/get-promotion/getPromotionVM'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const promotionUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  listProducts(useProductGateway())
  await getPromotion(promotionUuid, usePromotionGateway())
  vm.value = getPromotionVM(routeName)
})

const edit = () => {
  router.push(`/promotions/edit/${promotionUuid}`)
}
</script>
