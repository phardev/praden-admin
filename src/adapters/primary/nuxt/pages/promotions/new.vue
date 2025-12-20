<template lang="pug">
.section
  h1.text-title Créer nouvelle promotion
  promotion-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { promotionFormCreateVM } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { createPromotion } from '@core/usecases/promotions/promotion-creation/createPromotion'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { usePromotionGateway } from '../../../../../../gateways/promotionGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listProducts(100, 0, useProductGateway())
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name as string
const vm = ref(promotionFormCreateVM(routeName))

const validate = async () => {
  await createPromotion(vm.value.getDto(), usePromotionGateway())
  router.push('/promotions/')
}
</script>
