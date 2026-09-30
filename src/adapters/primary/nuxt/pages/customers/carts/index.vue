<template lang="pug">
.section
  .flex.items-center.justify-between.mb-4
    h1.text-title {{ $t('carts.title') }}
  carts-list(:carts-vm="cartsVM" @load-more="loadMore")
</template>

<script lang="ts" setup>
import { getCartsListVM } from '@adapters/primary/view-models/carts/get-carts-list/getCartsListVM'
import { CartListTab } from '@core/entities/cart'
import { listCarts } from '@core/usecases/carts/cart-listing/listCarts'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import { useCartGateway } from '../../../../../../../gateways/cartGateway'

definePageMeta({ layout: 'main' })

const limit = 50
const offsets: Record<CartListTab, number> = {
  [CartListTab.All]: 0,
  [CartListTab.Open]: 0,
  [CartListTab.Abandoned]: 0,
  [CartListTab.Closed]: 0
}
const { t } = useI18n()

const cartsVM = computed(() => getCartsListVM())

const hasMore = (tab: CartListTab): boolean =>
  !!cartsVM.value.tabs.find((tabVM) => tabVM.tab === tab)?.hasMore

const loadMore = async (tab: CartListTab, state: StateHandler) => {
  try {
    await listCarts(tab, { limit, offset: offsets[tab] }, useCartGateway())
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
