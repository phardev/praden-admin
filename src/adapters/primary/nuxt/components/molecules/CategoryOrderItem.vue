<template lang="pug">
.category-item.flex.items-center.p-3.bg-white.border.rounded.cursor-move.transition-all(
  :class="{ 'hover:bg-gray-50': !isDragging, 'opacity-50': isDragging }"
)
  icon.mr-3.text-gray-400.flex-shrink-0(name="i-heroicons-bars-3" class="text-xl")
  img.mr-3.rounded(
    v-if="category.miniature"
    :src="category.miniature"
    :alt="category.name"
    width="40"
    height="40"
  )
  span.font-medium.flex-1 {{ category.name }}
</template>

<script lang="ts" setup>
import type { Category } from '@core/entities/category'

defineProps<{
  category: Category
  isDragging?: boolean
}>()
</script>

<style scoped>
.category-item {
  transition: all 0.2s ease;
}
</style>
