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

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name
const vm = ref(createProductVM(routeName))

const validate = async () => {
  // await createPromotion(vm.value.dto, usePromotionGateway())
  router.push('/products/')
}
</script>
