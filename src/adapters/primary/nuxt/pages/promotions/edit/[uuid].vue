<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer promotion
  promotion-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { promotionFormEditVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormEditVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { editPromotion } from '@core/usecases/promotions/promotion-edition/editPromotion'
import { getPromotion } from '@core/usecases/promotions/promotion-get/getPromotion'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const promotionUuid = route.params.uuid as string
const router = useRouter()
const routeName = String(router.currentRoute.value.name)

onMounted(async () => {
  listProducts(100, 0, useProductGateway())
  listCategories(useCategoryGateway())
  await getPromotion(promotionUuid, usePromotionGateway())
  vm.value = promotionFormEditVM(routeName)
})

const validate = async () => {
  await editPromotion(promotionUuid, vm.value.getDto(), usePromotionGateway())
  router.push('/promotions/')
}
</script>
