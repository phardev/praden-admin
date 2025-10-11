<template lang="pug">
.space-y-2
  draggable(
    :model-value="categories"
    item-key="uuid"
    handle=".category-item"
    @start="onDragStart"
    @end="onDragEnd"
  )
    template(#item="{ element }")
      CategoryOrderItem(
        :category="element"
        :is-dragging="draggedUuid === element.uuid"
      )
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'
import CategoryOrderItem from '@adapters/primary/nuxt/components/molecules/CategoryOrderItem.vue'
import type { Category } from '@core/entities/category'

const props = defineProps<{
  categories: Array<Category>
}>()

const emit = defineEmits<{
  (e: 'reorder', oldIndex: number, newIndex: number): void
}>()

const draggedUuid = ref<string | null>(null)

const onDragStart = (event: any) => {
  draggedUuid.value = props.categories[event.oldIndex]?.uuid || null
}

const onDragEnd = (event: any) => {
  draggedUuid.value = null
  emit('reorder', event.oldIndex, event.newIndex)
}
</script>
