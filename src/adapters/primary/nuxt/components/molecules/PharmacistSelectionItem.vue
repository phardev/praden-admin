<template lang="pug">
.product-item.flex.items-center.gap-4.p-4.bg-white.border.border-gray-200.rounded-lg.transition-all(
  :class="{ 'hover:border-gray-300 hover:shadow-sm': !isDragging, 'opacity-50': isDragging, 'cursor-move': !isDragging }"
)
  .flex.items-center.gap-4.flex-1
    icon.text-gray-400.flex-shrink-0.cursor-move(
      name="i-heroicons-bars-3-bottom-left"
    )
    img.rounded.object-cover(
      v-if="product.miniature"
      :src="product.miniature"
      :alt="product.name"
      width="48"
      height="48"
    )
    .flex-1.min-w-0
      .font-medium.text-gray-900.truncate {{ product.name }}
      .text-sm.text-gray-600.mt-1(v-if="product.priceWithoutTax") {{ formatPrice(calculatePriceWithTax(product.priceWithoutTax, product.percentTaxRate)) }}
  UButton(
    color="gray"
    variant="ghost"
    icon="i-heroicons-trash"
    size="sm"
    aria-label="Retirer le produit"
    @click="$emit('remove')"
  )
</template>

<script lang="ts" setup>
import type { ProductForDisplay } from '@adapters/primary/view-models/pharmacist-selection/pharmacist-selection-form/pharmacistSelectionFormVM'

defineProps<{
  product: ProductForDisplay
  isDragging?: boolean
}>()

defineEmits<{
  (e: 'remove'): void
}>()

const calculatePriceWithTax = (
  priceWithoutTax: number,
  percentTaxRate: number
): number => {
  return Math.round(priceWithoutTax * (1 + percentTaxRate / 100))
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price / 100)
}
</script>
