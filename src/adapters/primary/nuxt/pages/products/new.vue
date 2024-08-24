<template lang="pug">
.section
  h1.text-title Créer nouveau produit
  product-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { productFormCreateVM } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { createProduct } from '@core/usecases/product/product-creation/createProduct'
import { useLocationGateway } from '../../../../../../gateways/locationGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(productFormCreateVM(routeName))

const validate = async () => {
  await createProduct(
    vm.value.getDto(),
    useProductGateway(),
    useLocationGateway()
  )
  router.push('/products/')
}
</script>
