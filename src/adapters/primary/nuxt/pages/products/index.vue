<template lang="pug">
.section
  div.flex.flex-row-reverse
    nuxt-link(to="/products/new")
      ft-button.button-solid.text-xl.px-6 Créer produit
  product-table(
    :headers="productsVM.headers"
    :items="productsVM.items"
    :is-loading="productsVM.isLoading"
    :selectable="true"
    :selection="productSelector.get()"
    :sort="productsVM.sort"
    @item-selected="productSelector.toggleSelect"
    @select-all="productSelector.toggleSelectAll"
    @clicked="productSelected"
    @sort="sortChanged"
  )
    template(#title) Produits
    template(#search)
      div.space-y-3
        div.flex.flex-wrap.items-start.gap-4
          UFormGroup(
            class="flex-1 min-w-[16rem] max-w-md"
            label="Recherche"
            name="search"
          )
            ft-text-field(
              v-model="search"
              placeholder="Rechercher par nom, référence, catégorie, laboratoire"
              for="search"
              type='text'
              name='search'
              @input="searchChanged"
            )
            p.warning.text-warning(v-if="productsVM.searchError") {{ productsVM.searchError }}
          UFormGroup.shrink-0(label="Statut" name="productStatus")
            ft-product-status-select(
              v-model="productStatus"
              @update:model-value="productStatusChanged"
              @clear="clearProductStatus"
            )
          UFormGroup.shrink-0(class="w-72" label="Prix TTC" name="priceTtc")
            ft-price-conditions(
              :conditions="priceTtcConditions"
              @update:conditions="priceConditionsChanged"
            )
        ft-filter-chips(
          :filters="productsVM.activeFilters || []"
          @remove="removeFilter"
          @clear-all="clearAllFilters"
        )
    template(#name="{ item }")
      .font-medium.text-default {{ item.name }}
    template(#infinite)
      InfiniteLoading(@infinite="load")
        template(#complete)
          div
  .mt-4.flex.gap-4
    ft-button.button-solid.text-base(
      :disabled="!productSelector.get().length"
      @click="openBulkEditDialog"
    ) Modifier la sélection
  ft-bulk-edit-product-modal(
    v-model="isBulkEditProductModalOpened"
    :selected-count="productSelector.get().length"
    @close="isBulkEditProductModalOpened = false"
    @submit="handleBulkEdit"
  )
</template>

<script lang="ts" setup>
import { getProductsVM } from '@adapters/primary/view-models/products/get-products/getProductsVM'
import type { ActiveFilterVM } from '@adapters/primary/view-models/shared/filters'
import type { ProductStatus } from '@core/entities/product'
import { listCategories } from '@core/usecases/categories/list-categories/listCategories'
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import type { ProductsSort } from '@core/usecases/product/product-searching/searchProducts'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import type { PriceFilterOperator } from '@core/usecases/shared/priceFilter'
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

interface PriceConditionRow {
  operator: PriceFilterOperator
  amount: number | undefined
}

definePageMeta({ layout: 'main' })

const productGateway = useProductGateway()
const limit = 25
let offset = 0
let searchOffset = 0
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

const load = async ($state: InfiniteLoadingState) => {
  if (
    !search.value &&
    !productStatus.value &&
    !sort.value &&
    !validPriceConditions().length
  ) {
    await listProducts(limit, offset, productGateway)
    offset += limit
    if (productsVM.value.hasMore) {
      $state.loaded()
    } else {
      $state.complete()
    }
  } else {
    if (productsVM.value.isLoading) {
      return
    }
    if (!productsVM.value.hasMoreSearch) {
      $state.complete()
      return
    }
    await searchProducts(
      String(routeName),
      buildFilters({
        query: search.value,
        status: productStatus.value,
        minimumQueryLength,
        size: limit,
        from: searchOffset
      }),
      useSearchGateway()
    )
    searchOffset += limit
    if (productsVM.value.hasMoreSearch) {
      $state.loaded()
    } else {
      $state.complete()
    }
  }
}

const search = ref(productsVM.value.currentSearch?.query)
const productStatus = ref(productsVM.value.currentSearch?.status)
const sort = ref<ProductsSort | undefined>(productsVM.value.currentSearch?.sort)
const minimumQueryLength = 3
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const emptyPriceCondition = (): PriceConditionRow => ({
  operator: 'lte',
  amount: undefined
})
const restorePriceConditions = (): Array<PriceConditionRow> => {
  const persisted = productsVM.value.currentSearch?.priceTtcConditions
  if (!persisted?.length) return [emptyPriceCondition()]
  return persisted.map((condition) => ({
    operator: condition.operator,
    amount: condition.value / 100
  }))
}
const priceTtcConditions = ref<Array<PriceConditionRow>>(
  restorePriceConditions()
)
const isValidPriceRow = (condition: PriceConditionRow) =>
  condition.amount != null && condition.amount > 0
const validPriceConditions = () =>
  priceTtcConditions.value.filter(isValidPriceRow)
const toSearchConditions = (rows: Array<PriceConditionRow>) =>
  rows.filter(isValidPriceRow).map((condition) => ({
    operator: condition.operator,
    value: Math.round((condition.amount as number) * 100)
  }))

const buildFilters = (partial: {
  query?: string
  status?: ProductStatus
  minimumQueryLength?: number
  size?: number
  from?: number
}) => {
  const priceTtcConditionsFilter = toSearchConditions(priceTtcConditions.value)
  return {
    query: search.value,
    status: productStatus.value,
    priceTtcConditions: priceTtcConditionsFilter.length
      ? priceTtcConditionsFilter
      : undefined,
    size: limit,
    sort: sort.value,
    ...partial
  }
}

const nextSort = (
  current: ProductsSort | undefined,
  field: string
): ProductsSort | undefined => {
  if (!current || current.field !== field) return { field, direction: 'asc' }
  if (current.direction === 'asc') return { field, direction: 'desc' }
  return undefined
}

const sortChanged = (field: string) => {
  sort.value = nextSort(sort.value, field)
  searchOffset = 0
  searchProducts(
    String(routeName),
    buildFilters({ from: 0 }),
    useSearchGateway()
  )
}

const searchChanged = (e: any) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchOffset = 0
    const filters = {
      query: e.target.value,
      minimumQueryLength,
      from: 0
    }
    searchProducts(
      String(routeName),
      buildFilters({ ...filters }),
      useSearchGateway()
    )
  }, 300)
}

const productStatusChanged = (status: ProductStatus) => {
  searchOffset = 0
  searchProducts(
    String(routeName),
    buildFilters({ status, from: 0 }),
    useSearchGateway()
  )
}

const clearProductStatus = () => {
  searchOffset = 0
  productStatus.value = undefined
  searchProducts(
    String(routeName),
    buildFilters({ status: undefined, from: 0 }),
    useSearchGateway()
  )
}

const searchWithCurrentFilters = () => {
  searchOffset = 0
  searchProducts(
    String(routeName),
    buildFilters({ from: 0 }),
    useSearchGateway()
  )
}

const priceConditionsChanged = (conditions: Array<PriceConditionRow>) => {
  const before = JSON.stringify(toSearchConditions(priceTtcConditions.value))
  priceTtcConditions.value = conditions
  if (JSON.stringify(toSearchConditions(conditions)) === before) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(searchWithCurrentFilters, 300)
}

const removeFilter = (filter: ActiveFilterVM) => {
  if (filter.key === 'priceTtc' && filter.index !== undefined) {
    const target = validPriceConditions()[filter.index]
    priceTtcConditions.value = priceTtcConditions.value.filter(
      (condition) => condition !== target
    )
  }
  searchWithCurrentFilters()
}

const clearAllFilters = () => {
  priceTtcConditions.value = [emptyPriceCondition()]
  searchWithCurrentFilters()
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
