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
import { createProductVM } from '@adapters/primary/view-models/products/create-product/createProductVM'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { createProduct } from '@core/usecases/product/product-creation/createProduct'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(createProductVM(routeName))

const validate = async () => {
  console.log('on cree le produit: ', vm.value.getDto())
  await createProduct(vm.value.getDto(), useProductGateway())
  router.push('/products/')
}
</script>
