<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/products/new")
      ft-button.button-solid.text-xl.px-6 Créer produit
  ft-table(
    :headers="productsVM.headers"
    :items="productsVM.items"
    @clicked="productSelected"
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
import { getProductsVM } from '@adapters/primary/view-models/products/get-products/getProductsVM'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  const categoryStore = useCategoryStore()
  categoryStore.items = [dents, diarrhee]
  listCategories(useCategoryGateway())
  listProducts(useProductGateway())
})

const productsVM = computed(() => {
  return getProductsVM()
})

const productSelected = (uuid: string) => {
  const router = useRouter()
  router.push(`/products/get/${uuid}`)
}
</script>
