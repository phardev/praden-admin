<template lang="pug">
UModal(:model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)")
  UCard
    template(#header)
      h3.text-lg.font-semibold {{ $t('shopManagement.homepageShowcase.searchProducts') }}

    template(#default)
      .space-y-4
        UInput(
          v-model="searchQuery"
          :placeholder="$t('shopManagement.homepageShowcase.searchProducts')"
          icon="i-heroicons-magnifying-glass"
          @input="onSearchInput"
        )

        .flex.items-center.gap-3(v-if="promotionsFilter")
          UToggle#promotions-only(v-model="promotionsOnly" @update:model-value="search")
          label.text-sm.text-gray-700.cursor-pointer(for="promotions-only") {{ $t('shopManagement.homepageShowcase.promotionsOnly') }}

        div(v-if="isWaitingForQuery")
          .text-center.py-8.text-gray-500
            icon.mb-2(name="i-heroicons-magnifying-glass" class="text-4xl")
            p {{ $t('shopManagement.homepageShowcase.minimumSearch') }}

        div(v-else-if="searchVM.isLoading")
          .space-y-3
            USkeleton.h-16(v-for="n in 3" :key="n")

        div(v-else-if="searchVM.hasError")
          .text-center.py-8.text-gray-500
            icon.mb-2(name="i-heroicons-exclamation-circle" class="text-4xl")
            p {{ searchVM.errorMessage }}

        div(v-else-if="searchVM.searchResults.length === 0")
          .text-center.py-8.text-gray-500
            icon.mb-2(name="i-heroicons-magnifying-glass" class="text-4xl")
            p {{ $t('shopManagement.homepageShowcase.noResults') }}

        div(v-else)
          h4.text-md.font-semibold.mb-3 {{ $t('shopManagement.homepageShowcase.searchResults') }}
          .space-y-2.max-h-96.overflow-y-auto
            .product-item.p-4.bg-white.border.rounded.flex.items-center.justify-between.transition-all(
              v-for="product in searchVM.searchResults"
              :key="product.uuid"
              :class="{'bg-gray-50': product.isSelected}"
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
                :label="$t('shopManagement.homepageShowcase.addProduct')"
                @click="addProduct(product.uuid)"
              )

              span.flex.items-center.gap-1.text-sm.font-medium.text-green-700(v-else)
                icon(name="i-heroicons-check" aria-hidden="true")
                | {{ $t('shopManagement.homepageShowcase.alreadySelected') }}

    template(#footer)
      .flex.items-center.justify-between.gap-3
        span.text-sm.text-gray-600(aria-live="polite") {{ $t('shopManagement.homepageShowcase.selectedCount', { count: selectedProductUuids.length }, selectedProductUuids.length) }}
        UButton(
          color="primary"
          :label="$t('shopManagement.homepageShowcase.done')"
          @click="$emit('update:modelValue', false)"
        )
</template>

<script lang="ts" setup>
import { productSearchVM } from '@adapters/primary/view-models/products/product-search/productSearchVM'
import { ProductStatus } from '@core/entities/product'
import { searchProducts } from '@core/usecases/product/product-searching/searchProducts'
import { useSearchStore } from '@store/searchStore'
import { useSearchGateway } from '../../../../../../gateways/searchGateway'

const props = defineProps<{
  modelValue: boolean
  namespace: string
  selectedProductUuids: Array<string>
  promotionsFilter?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'product-added', productUuid: string): void
}>()

const searchQuery = ref('')
const minimumQueryLength = 3
const promotionsOnly = ref(props.promotionsFilter ?? false)
const searchGateway = useSearchGateway()
const searchStore = useSearchStore()

let debounceTimer: ReturnType<typeof setTimeout> | undefined

const searchVM = computed(() => {
  return productSearchVM(props.namespace, props.selectedProductUuids)
})

const isWaitingForQuery = computed(
  () =>
    !promotionsOnly.value &&
    (!searchQuery.value || searchQuery.value.length < minimumQueryLength)
)

const search = () => {
  if (isWaitingForQuery.value) {
    searchStore.set(props.namespace, [])
    return
  }
  searchProducts(
    props.namespace,
    {
      query: searchQuery.value,
      minimumQueryLength,
      status: ProductStatus.Active,
      isInPromotion: promotionsOnly.value
    },
    searchGateway
  )
}

const onSearchInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(search, 300)
}

const addProduct = (productUuid: string) => {
  emit('product-added', productUuid)
}

const hasResults = () => (searchStore.get(props.namespace) ?? []).length > 0

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && promotionsOnly.value && !hasResults()) {
      search()
    }
  }
)

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  searchStore.set(props.namespace, [])
})
</script>
