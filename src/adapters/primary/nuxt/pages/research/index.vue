<template lang="pug">
  ft-button.button-solid(@click="indexAll") Indexer
  div(v-if="vm.total")
    p Total: {{ vm.total }}
    p Indexé: {{ vm.indexedProducts }} / {{ vm.total }}
</template>

<script lang="ts" setup>
import { indexProductsVM } from '@adapters/primary/view-models/index/index-products/indexProductsVM'
import { getProductCount } from '@adapters/primary/view-models/products/get-product-count/getProductCount'
import { indexProducts } from '@core/usecases/product/product-indexation/indexProducts'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

definePageMeta({ layout: 'main' })

const vm = computed(() => {
  return indexProductsVM()
})

const indexAll = async () => {
  await getProductCount(useProductGateway())
  const limit = 200
  let offset = 0
  while (offset < vm.value.total) {
    await indexProducts(limit, offset, useSearchGateway())
    offset += limit
  }
}
</script>
