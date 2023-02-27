<template lang="pug">
.section
  ft-table(
    :headers="productsVM.headers"
    :items="productsVM.items"
  )
    template(#title) Produits
    template(#img="{ item }")
      .h-10.w-10
        img.rounded-full.h-10.w-10(:src="item.img")
    template(#name="{ item }")
      .font-medium.text-default {{ item.name }}
</template>

<script lang="ts" setup>
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { getProductsVM } from '@adapters/primary/view-models/get-products/getProductsVM'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'

definePageMeta({ layout: 'main' })

onMounted(() => {
  const categoryStore = useCategoryStore()
  categoryStore.items = [dents, diarrhee]
  listProducts(useProductGateway())
})

const productsVM = computed(() => {
  return getProductsVM()
})
</script>
