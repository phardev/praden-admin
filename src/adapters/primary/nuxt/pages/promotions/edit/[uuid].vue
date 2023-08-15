<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer promotion
  promotion-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'
import { editPromotionVM } from '@adapters/primary/view-models/promotions/edit-promotion/editPromotionVM'
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { editPromotion } from '@core/usecases/promotions/promotion-edition/editPromotion'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const promotionUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  listProducts(useProductGateway())
  await getPromotion(promotionUuid, usePromotionGateway())
  vm.value = editPromotionVM(routeName)
})

const validate = async () => {
  await editPromotion(promotionUuid, vm.value.dto, usePromotionGateway())
  router.push('/promotions/')
}
</script>
