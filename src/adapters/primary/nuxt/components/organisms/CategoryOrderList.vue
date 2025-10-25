<template lang="pug">
.space-y-2
  draggable(
    v-model="localCategories"
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
import CategoryOrderItem from '@adapters/primary/nuxt/components/molecules/CategoryOrderItem.vue'
import type { Category } from '@core/entities/category'
import draggable from 'vuedraggable'

const categories = defineModel<Array<Category>>({ required: true })

const localCategories = computed({
  get: () => categories.value,
  set: (v) => {
    categories.value = v
  }
})

const draggedUuid = ref<string | null>(null)

const onDragStart = (event: any) => {
  draggedUuid.value = categories.value[event.oldIndex]?.uuid || null
}

const onDragEnd = () => {
  draggedUuid.value = null
}
</script>
