<template lang="pug">
.section(v-if="vm")
  .flex.flex-row-reverse
    ft-button.button-solid.text-xl.px-6(@click="edit") Editer produit
  h1.text-title Voir produit
  product-form(
    :vm="vm"
  )
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { getProduct } from '@core/usecases/product/get-product/getProduct'
import { productFormGetVM } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { listPromotions } from '@core/usecases/promotions/promotions-listing/listPromotions'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const productUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

onMounted(async () => {
  const categoryGateway = useCategoryGateway()
  listCategories(categoryGateway)
  const productGateway = useProductGateway()
  const promotionGateway = usePromotionGateway()
  listPromotions(promotionGateway)
  await getProduct(
    productUuid,
    productGateway,
    promotionGateway,
    useDateProvider()
  )
  vm.value = productFormGetVM(routeName)
})

const edit = () => {
  router.push(`/products/edit/${productUuid}`)
}
</script>
