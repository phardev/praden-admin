<template lang="pug">
div
  .mb-6
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.productsStep') }}
    UInput.mb-4(
      v-model="productSearch"
      :placeholder="$t('orders.create.searchProduct')"
      icon="i-heroicons-magnifying-glass"
      @input="onProductSearchInput"
    )
    .space-y-2.max-h-48.overflow-y-auto.mb-4(v-if="productResults.length > 0")
      .p-3.border.rounded.cursor-pointer.transition-colors(class="hover:bg-gray-50"
        v-for="product in productResults"
        :key="product.uuid"
        @click="handleProductSelected(product)"
      )
        .font-medium {{ product.name }}
        .text-sm.text-gray-500 {{ product.ean13 }} - {{ formatCents(product.priceWithoutTax) }}

  .mb-6(v-if="lines.length === 0")
    .text-center.py-8.text-gray-400
      p {{ $t('orders.create.noProducts') }}

  .mb-6(v-else)
    .border.rounded
      .grid.grid-cols-12.gap-2.p-3.bg-gray-50.font-semibold.text-sm
        .col-span-4 {{ $t('orders.create.product') }}
        .col-span-2 {{ $t('orders.create.quantity') }}
        .col-span-2 {{ $t('orders.create.unitPrice') }}
        .col-span-2 {{ $t('orders.create.lineTotal') }}
        .col-span-2
      .grid.grid-cols-12.gap-2.p-3.items-center.border-t(
        v-for="(line, index) in lines"
        :key="line.productUuid"
      )
        .col-span-4
          .font-medium {{ line.productName }}
        .col-span-2
          UInput(
            type="number"
            :model-value="line.quantity"
            min="1"
            @update:model-value="quantityChanged(index, $event)"
          )
        .col-span-2
          UInput(
            type="number"
            :model-value="line.priceWithoutTax / 100"
            step="0.01"
            @update:model-value="priceChanged(index, $event)"
          )
        .col-span-2
          span {{ formatCents(currentVM.getLineTotalWithTax(index)) }}
        .col-span-2
          UButton(
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            size="sm"
            @click="currentVM.removeLine(index)"
          ) {{ $t('orders.create.removeProduct') }}

  .flex.justify-between.items-center.pt-4.border-t(v-if="lines.length > 0")
    .text-lg.font-semibold {{ $t('orders.create.orderTotal') }}
    .text-lg.font-semibold {{ formatCents(currentVM.getOrderTotalWithTax()) }}

  .mt-6(v-if="lines.length > 0")
    h3.text-lg.font-semibold.mb-4 {{ $t('orders.create.promotionCode') }}
    .flex.gap-2
      UInput(
        :model-value="currentVM.get('promotionCode') || ''"
        :placeholder="$t('orders.create.promotionCode')"
        @update:model-value="promotionCodeChanged"
      )
      ft-button(
        @click.prevent=""
      ) {{ $t('orders.create.applyPromo') }}
</template>

<script lang="ts" setup>
import type { CreateOrderVM } from '@adapters/primary/view-models/orders/create-order/createOrderVM'
import type { Product } from '@core/entities/product'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSearchStore } from '@store/searchStore'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

const props = defineProps<{
  vm: CreateOrderVM
}>()

const currentVM = toRef(props, 'vm')
const productSearch = ref('')
const searchStore = useSearchStore()
const searchGateway = useSearchGateway()
const namespace = 'manual-order-product-search'

let debounceTimer: ReturnType<typeof setTimeout> | undefined

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
})

const formatCents = (cents: number): string => {
  return formatter.format(cents / 100)
}

const lines = computed(() => {
  return currentVM.value.get('lines') || []
})

const productResults = computed((): Array<Product> => {
  return searchStore.get(namespace) || []
})

const onProductSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchProducts(
      namespace,
      { query: productSearch.value, minimumQueryLength: 3 },
      searchGateway
    )
  }, 300)
}

const handleProductSelected = (product: Product) => {
  currentVM.value.addLine({
    productUuid: product.uuid,
    productName: product.name,
    priceWithoutTax: product.priceWithoutTax,
    percentTaxRate: product.percentTaxRate,
    quantity: 1,
    weight: product.weight
  })
  productSearch.value = ''
  searchStore.set(namespace, [])
}

const quantityChanged = (index: number, value: string | number) => {
  const qty = typeof value === 'string' ? parseInt(value) : value
  if (qty >= 1) {
    currentVM.value.setLineQuantity(index, qty)
  }
}

const priceChanged = (index: number, value: string | number) => {
  const price =
    typeof value === 'string'
      ? Math.round(parseFloat(value) * 100)
      : value * 100
  currentVM.value.setLinePrice(index, price)
}

const promotionCodeChanged = (value: string) => {
  currentVM.value.set('promotionCode', value || undefined)
}
</script>
