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
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { editPromotion } from '@core/usecases/promotions/promotion-edition/editPromotion'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { promotionFormEditVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormEditVM'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const promotionUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  listProducts(useProductGateway())
  listCategories(useCategoryGateway())
  await getPromotion(promotionUuid, usePromotionGateway())
  vm.value = promotionFormEditVM(routeName)
})

const validate = async () => {
  console.log('vm.value.dto: ', vm.value.getDto())
  await editPromotion(promotionUuid, vm.value.getDto(), usePromotionGateway())
  router.push('/promotions/')
}
</script>
