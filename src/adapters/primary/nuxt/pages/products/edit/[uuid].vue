<template lang="pug">
.section(v-if="vm")
  h1.text-title Editer produit
  product-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../../gateways/productGateway'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { getProduct } from '@core/usecases/product/get-product/getProduct'
import { productFormEditVM } from '@adapters/primary/view-models/products/product-form/productFormEditVM'
import { editProduct } from '@core/usecases/product/product-edition/editProduct'
import { useLocationGateway } from '../../../../../../../gateways/locationGateway'
import { usePromotionGateway } from '../../../../../../../gateways/promotionGateway'
import { useDateProvider } from '../../../../../../../gateways/dateProvider'

definePageMeta({ layout: 'main' })

const vm = ref()
const route = useRoute()
const productUuid = route.params.uuid
const router = useRouter()
const routeName = router.currentRoute.value.name

const limit = 25
const offset = 0

onMounted(async () => {
  const categoryGateway = useCategoryGateway()
  listCategories(categoryGateway)
  const productGateway = useProductGateway()
  listProducts(limit, offset, productGateway)
  await getProduct(
    productUuid,
    productGateway,
    usePromotionGateway(),
    useDateProvider()
  )
  vm.value = productFormEditVM(routeName)
})

const validate = async () => {
  await editProduct(
    productUuid,
    vm.value.getDto(),
    useProductGateway(),
    useLocationGateway()
  )
  router.push('/products/')
}
</script>
