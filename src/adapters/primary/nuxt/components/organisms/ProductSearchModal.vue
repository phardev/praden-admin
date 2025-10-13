<template lang="pug">
UModal(:model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)")
  UCard
    template(#header)
      h3.text-lg.font-semibold {{ $t('shopSettings.pharmacistSelection.searchProducts') }}

    template(#default)
      .space-y-4
        UInput(
          v-model="searchQuery"
          :placeholder="$t('shopSettings.pharmacistSelection.searchProducts')"
          icon="i-heroicons-magnifying-glass"
          @input="onSearchInput"
        )

        div(v-if="!searchQuery || searchQuery.length < minimumQueryLength")
          .text-center.py-8.text-gray-500
            icon.mb-2(name="i-heroicons-magnifying-glass" class="text-4xl")
            p {{ $t('shopSettings.pharmacistSelection.minimumSearch') }}

        div(v-else-if="searchVM.isLoading")
          .flex.justify-center.items-center.py-8
            icon.animate-spin.h-6.w-6(name="i-heroicons-arrow-path")
            span.ml-2 {{ $t('common.loading') }}

        div(v-else-if="searchVM.hasError")
          .text-center.py-8.text-gray-500
            icon.mb-2(name="i-heroicons-exclamation-circle" class="text-4xl")
            p {{ searchVM.errorMessage }}

        div(v-else-if="searchVM.searchResults.length === 0")
          .text-center.py-8.text-gray-500
            icon.mb-2(name="i-heroicons-magnifying-glass" class="text-4xl")
            p {{ $t('shopSettings.pharmacistSelection.noResults') }}

        div(v-else)
          h4.text-md.font-semibold.mb-3 {{ $t('shopSettings.pharmacistSelection.searchResults') }}
          .space-y-2.max-h-96.overflow-y-auto
            .product-item.p-4.bg-white.border.rounded.flex.items-center.justify-between.transition-all(
              v-for="product in searchVM.searchResults"
              :key="product.uuid"
              :class="{'opacity-50': product.isSelected}"
            )
              .flex.items-center.flex-1
                img.mr-3.rounded(
                  v-if="product.miniature"
                  :src="product.miniature"
                  :alt="product.name"
                  width="40"
                  height="40"
                )
                .flex-1
                  .font-medium {{ product.name }}
                  .text-sm.text-gray-600 {{ product.formattedPrice }}

              UButton(
                v-if="!product.isSelected"
                color="primary"
                variant="soft"
                icon="i-heroicons-plus"
                :label="$t('shopSettings.pharmacistSelection.addProduct')"
                @click="addProduct(product.uuid)"
              )

              span.text-sm.text-gray-500(v-else) {{ $t('shopSettings.pharmacistSelection.alreadySelected') }}
</template>

<script lang="ts" setup>
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'
import { productSearchVM } from '@adapters/primary/view-models/products/product-search/productSearchVM'
import { useSearchStore } from '@store/searchStore'

const props = defineProps<{
  modelValue: boolean
  selectedProductUuids: Array<string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'product-added', productUuid: string): void
}>()

const searchQuery = ref('')
const minimumQueryLength = 3
const namespace = 'pharmacist-selection-modal'
const searchGateway = useSearchGateway()
const searchStore = useSearchStore()

let debounceTimer: ReturnType<typeof setTimeout> | undefined

const searchVM = computed(() => {
  return productSearchVM(namespace, props.selectedProductUuids)
})

const onSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    const filters = {
      query: searchQuery.value,
      minimumQueryLength
    }
    searchProducts(namespace, filters, searchGateway)
  }, 300)
}

const addProduct = (productUuid: string) => {
  emit('product-added', productUuid)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      searchQuery.value = ''
      searchStore.set(namespace, [])
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }
)
</script>
