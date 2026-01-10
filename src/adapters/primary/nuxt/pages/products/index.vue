<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/products/new")
      ft-button.button-solid.text-xl.px-6 Créer produit
  product-table(
    :headers="productsVM.headers"
    :items="productsVM.items"
    :is-loading="showTableSkeleton"
    :selectable="true"
    :selection="productSelector.get()"
    @item-selected="productSelector.toggleSelect"
    @select-all="productSelector.toggleSelectAll"
    @clicked="productSelected"
  )
    template(#title) Produits
    template(#search)
      .flex.items-center.justify-center.space-x-4
        .flex-grow
          ft-text-field(
            v-model="search"
            placeholder="Rechercher par nom, référence, catégorie, laboratoire"
            for="search"
            type='text'
            name='search'
            @input="searchChanged"
          ) Rechercher un produit
          p.warning.text-warning(v-if="productsVM.searchError") {{ productsVM.searchError }}
        UFormGroup.pb-4(label="Statut" name="productStatus")
          ft-product-status-select(
            v-model="productStatus"
            @update:model-value="productStatusChanged"
            @clear="clearProductStatus"
          )
    template(#name="{ item }")
      .font-medium.text-default {{ item.name }}
  .mt-4.flex.gap-4
    ft-button.button-solid.text-base(
      :disabled="!productSelector.get().length"
      @click="openBulkEditDialog"
    ) Modifier la sélection
  InfiniteLoading(@infinite="load")
    template(#complete)
      div
  ft-bulk-edit-product-modal(
    v-model="isBulkEditProductModalOpened"
    :selected-count="productSelector.get().length"
    @close="isBulkEditProductModalOpened = false"
    @submit="handleBulkEdit"
  )
</template>

<script lang="ts" setup>
import { getProductsVM } from '@adapters/primary/view-models/products/get-products/getProductsVM'
import type { ProductStatus } from '@core/entities/product'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { resetProducts } from '@core/usecases/product/product-reset/resetProducts'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'
import InfiniteLoading from 'v3-infinite-loading'
import { useCategoryGateway } from '../../../../../../gateways/categoryGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import 'v3-infinite-loading/lib/style.css'
import { bulkEditProduct } from '@core/usecases/product/product-edition/bulkEditProduct'
import { useSelection } from '../../composables/useSelection'

interface InfiniteLoadingState {
  loaded: () => void
  complete: () => void
}

definePageMeta({ layout: 'main' })

const productGateway = useProductGateway()
const limit = 25
let offset = 0
const isLoadingProducts = ref(false)
const productSelector = useSelection()
const isBulkEditProductModalOpened = ref(false)

const handleBulkEdit = async (dto: { arePromotionsAllowed: boolean }) => {
  isBulkEditProductModalOpened.value = false
  await bulkEditProduct({ productGateway })({
    uuids: productSelector.get(),
    dto: { flags: { arePromotionsAllowed: dto.arePromotionsAllowed } }
  })
  productSelector.clear()
}

onMounted(() => {
  resetProducts()
  offset = 0
  isLoadingProducts.value = false
  const categoryStore = useCategoryStore()
  categoryStore.items = [dents, diarrhee]
  listCategories(useCategoryGateway())
  productSelector.clear()
})

const router = useRouter()
const routeName = String(router.currentRoute.value.name ?? '')

const productsVM = computed(() => {
  return getProductsVM(routeName)
})

const showTableSkeleton = computed(() => {
  return productsVM.value.isLoading && productsVM.value.items.length === 0
})

const load = async ($state: InfiniteLoadingState) => {
  if (isLoadingProducts.value) {
    return
  }

  if (search.value) {
    $state.complete()
    return
  }

  if (!productsVM.value.hasMore && offset > 0) {
    $state.complete()
    return
  }

  isLoadingProducts.value = true
  try {
    await listProducts(limit, offset, productGateway)
    offset += limit

    if (productsVM.value.hasMore) {
      $state.loaded()
    } else {
      $state.complete()
    }
  } finally {
    isLoadingProducts.value = false
  }
}

const search = ref(productsVM.value.currentSearch?.query)
const productStatus = ref(productsVM.value.currentSearch?.status)
const minimumQueryLength = 3
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const buildFilters = (partial: {
  query?: string
  status?: ProductStatus
  minimumQueryLength?: number
}) => {
  return {
    query: search.value,
    status: productStatus.value,
    ...partial
  }
}

const searchChanged = (e: any) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const filters = {
      query: e.target.value,
      minimumQueryLength
    }
    searchProducts(
      String(routeName),
      buildFilters({ ...filters }),
      useSearchGateway()
    )
  }, 300)
}

const productStatusChanged = (status: ProductStatus) => {
  searchProducts(
    String(routeName),
    buildFilters({ status }),
    useSearchGateway()
  )
}

const clearProductStatus = () => {
  productStatus.value = undefined
  searchProducts(
    String(routeName),
    buildFilters({ status: undefined }),
    useSearchGateway()
  )
}

const productSelected = (uuid: string) => {
  router.push(`/products/get/${uuid}`)
}

const openBulkEditDialog = () => {
  isBulkEditProductModalOpened.value = true
}
</script>

<style scoped>
.warning {
  font-size: 0.9rem;
  margin-top: 5px;
}
</style>
