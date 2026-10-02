<template lang="pug">
.section
  .mb-4
    h1.text-title {{ $t('carts.title') }}
    p.text-sm.text-gray-500.mt-1 {{ $t('carts.abandonmentRule') }}
  ft-customer-period-filters.mb-4(
    :placeholder="$t('carts.filters.customerPlaceholder')"
    :current-filters="cartsVM.currentFilters"
    :active-filters="cartsVM.activeFilters"
    @change="applyFilters"
  )
  carts-list(:carts-vm="cartsVM" :reload-key="reloadKey" @load-more="loadMore")
</template>

<script lang="ts" setup>
import { getCartsListVM } from '@adapters/primary/view-models/carts/get-carts-list/getCartsListVM'
import { type CartListFilters, CartListTab } from '@core/entities/cart'
import { filterCarts } from '@core/usecases/carts/cart-listing/filterCarts'
import { listCarts } from '@core/usecases/carts/cart-listing/listCarts'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import { useCartGateway } from '../../../../../../../gateways/cartGateway'

definePageMeta({ layout: 'main' })

const limit = 50
const firstPages = (): Record<CartListTab, number> => ({
  [CartListTab.All]: 0,
  [CartListTab.Open]: 0,
  [CartListTab.Abandoned]: 0,
  [CartListTab.Closed]: 0
})
let offsets = firstPages()
const reloadKey = ref(0)
const { t } = useI18n()

const cartsVM = computed(() => getCartsListVM())

const hasMore = (tab: CartListTab): boolean =>
  !!cartsVM.value.tabs.find((tabVM) => tabVM.tab === tab)?.hasMore

const applyFilters = (filters: CartListFilters) => {
  filterCarts(filters)
  offsets = firstPages()
  reloadKey.value++
}

const loadMore = async (tab: CartListTab, state: StateHandler) => {
  const requestedWith = reloadKey.value
  try {
    await listCarts(tab, { limit, offset: offsets[tab] }, useCartGateway())
    if (requestedWith !== reloadKey.value) {
      return
    }
    offsets[tab] += limit
    if (hasMore(tab)) {
      state.loaded()
    } else {
      state.complete()
    }
  } catch {
    useToast().add({ title: t('carts.loadError'), color: 'red' })
    state.error()
  }
}
</script>
