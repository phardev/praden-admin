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
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { createPromotion } from '@core/usecases/promotions/promotion-creation/createPromotion'
import { usePromotionGateway } from '../../../../../../gateways/promotionGateway'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listProducts(useProductGateway())
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(promotionFormCreateVM(routeName))

const validate = async () => {
  await createPromotion(vm.value.getDto(), usePromotionGateway())
  router.push('/promotions/')
}
</script>
