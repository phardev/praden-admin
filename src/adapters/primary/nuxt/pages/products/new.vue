<template lang="pug">
.section
  h1.text-title Créer nouveau produit
  product-form(
    :vm="vm"
    @validate="validate"
  )
</template>

<script lang="ts" setup>
import { productFormCreateVM } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { createProduct } from '@core/usecases/product/product-creation/createProduct'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = String(router.currentRoute.value.name)
const vm = ref(productFormCreateVM(routeName))
const validate = async () => {
  await createProduct(vm.value.getDto(), useProductGateway())
  router.push('/products/')
}
</script>
