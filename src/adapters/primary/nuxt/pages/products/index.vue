<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/products/new")
      ft-button.button-solid.text-xl.px-6 Créer produit
  product-table(
    :headers="productsVM.headers"
    :items="productsVM.items"
    :is-loading="productsVM.isLoading"
    @clicked="productSelected"
  )
    template(#title) Produits
    template(#search)
      ft-text-field(
        v-model="search"
        placeholder="Rechercher par nom, référence, catégorie, laboratoire"
        for="search"
        type='text'
        name='search'
        @input="searchChanged"
      ) Rechercher un produit
      p.warning.text-warning(v-if="productsVM.searchError") {{ productsVM.searchError }}
    template(#name="{ item }")
      .font-medium.text-default {{ item.name }}
  InfiniteLoading(@infinite="load")
    template(#complete)
      div
</template>

<script lang="ts" setup>
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { getProductsVM } from '@adapters/primary/view-models/products/get-products/getProductsVM'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

definePageMeta({ layout: 'main' })

const productGateway = useProductGateway()
const limit = 25
let offset = 0

onMounted(() => {
  const categoryStore = useCategoryStore()
  categoryStore.items = [dents, diarrhee]
  listCategories(useCategoryGateway())
})

const router = useRouter()
const routeName = router.currentRoute.value.name

const productsVM = computed(() => {
  return getProductsVM(routeName)
})

const load = async ($state) => {
  if (!search.value) {
    await listProducts(limit, offset, productGateway)
    offset += limit
    if (productsVM.hasMore) {
      $state.loaded()
    } else {
      $state.complete()
    }
  } else {
    $state.complete()
  }
}

const search = ref(productsVM.value.currentSearch)
const minimumQueryLength = 3
let debounceTimer

const searchChanged = (e: any) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const filters = {
      query: e.target.value,
      minimumQueryLength
    }
    searchProducts(routeName, filters, useSearchGateway())
  }, 300)
}

const productSelected = (uuid: string) => {
  router.push(`/products/get/${uuid}`)
}
</script>

<style scoped>
.warning {
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>
