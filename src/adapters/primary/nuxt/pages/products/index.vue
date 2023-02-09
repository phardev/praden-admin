<template lang="pug">
.section
  .px-4(class='sm:px-6 lg:px-8')
    div(class='sm:flex sm:items-center')
      div(class='sm:flex-auto')
        h1.text-2xl.font-semibold.text-default Produits
    .-mx-4.mt-10.ring-1.ring-light(class='sm:-mx-6 md:mx-0 md:rounded-lg')
      table.min-w-full.divide-y.divide-light
        thead
          tr
            th.pl-4.pr-3.text-left.text-sm.font-semibold.text-default(
              v-for="(header, headerIndex) in productsVM.headers"
              :key="headerIndex"
              :class="[headerIndex === 0 ? 'pl-4 pr-3 sm:pl-6' : 'px-3 lg:table-cell', 'text-left text-sm font-semibold text-default py-3.5']"
              scope='col'
            ) {{ header }}
        tbody
          tr(v-for='(product) in productsVM.items' :key='product.reference')
            td.border-t.border-light.py-4.pl-4.pr-3(class="sm:pl-6")
              .h-10.w-10
                img.rounded-full.h-10.w-10(:src="product.img")
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast
              .font-medium.text-default
                | {{ product.name }}
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ product.reference }}
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ product.category }}
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ product.priceWithoutTax }}
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ product.priceWithTax }}
            td.border-t.border-light.px-3.py-3.text-sm.text-contrast {{ product.availableStock }}
</template>

<script lang="ts" setup>
import { listProducts } from '@core/usecases/product/product-listing/listProducts'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { getProductsVM } from '@adapters/primary/view-models/get-products/getProductsVM'
import { useCategoryStore } from '@store/categoryStore'
import { dents, diarrhee } from '@utils/testData/categories'

onMounted(() => {
  const categoryStore = useCategoryStore()
  categoryStore.items = [dents, diarrhee]
  listProducts(useProductGateway())
})

const productsVM = computed(() => {
  return getProductsVM()
})
</script>
