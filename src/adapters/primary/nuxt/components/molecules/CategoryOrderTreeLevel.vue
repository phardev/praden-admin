<template lang="pug">
.category-order-level
  draggable(
    v-model="localNodes"
    :group="groupName"
    item-key="data.uuid"
    handle=".drag-handle"
    @start="onDragStart"
    @end="onDragEnd"
  )
    template(#item="{ element }")
      .category-node-wrapper.mb-2
        .flex.gap-2
          .drag-handle.cursor-move.p-2.hover_bg-gray-100.rounded.flex-shrink-0
            icon(name="i-heroicons-bars-3" class="text-gray-400")
          .flex-1
            .category-item-wrapper.flex.justify-between.items-center.p-2.cursor-pointer.bg-hover(
              @click="element.children && element.children.length > 0 ? toggleNode(element.data.uuid) : null"
            )
              .flex.items-center.gap-3.flex-1
                img.rounded(
                  v-if="element.data.miniature"
                  :src="element.data.miniature"
                  :alt="element.data.name"
                  width="40"
                  height="40"
                )
                span.font-medium {{ element.data.name }}
              .expand-button.flex.items-center.justify-center(
                v-if="element.children && element.children.length > 0"
              )
                icon.icon-md(
                  v-if="isOpen(element.data.uuid)"
                  name="material-symbols-light:keyboard-arrow-up"
                )
                icon.icon-md(
                  v-else
                  name="material-symbols-light:keyboard-arrow-down"
                )
        .category-children(
          v-if="element.children && element.children.length > 0 && isOpen(element.data.uuid)"
          :class="{'pl-8 mt-2 border-l-2 border-gray-200': level < 3}"
        )
          CategoryOrderTreeLevel(
            v-model="element.children"
            :level="level + 1"
            :parent-uuid="element.data.uuid"
            :open-items="openItems"
            @update:open-items="$emit('update:open-items', $event)"
          )
</template>

<script lang="ts" setup>
import CategoryOrderItem from '@adapters/primary/nuxt/components/molecules/CategoryOrderItem.vue'
import type {
  TreeCategoryNodeVM,
  TreeNode
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import type { Category } from '@core/entities/category'
import draggable from 'vuedraggable'

const props = defineProps<{
  modelValue: Array<TreeNode<TreeCategoryNodeVM>>
  level: number
  parentUuid: string | null
  openItems?: Array<string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<TreeNode<TreeCategoryNodeVM>>): void
  (e: 'update:open-items', items: Array<string>): void
}>()

const groupName = computed(() => `category-level-${props.parentUuid || 'root'}`)

const localNodes = computed({
  get: () => props.modelValue,
  set: (v) => {
    emit('update:modelValue', v)
  }
})

const categoryFromNode = (node: TreeNode<TreeCategoryNodeVM>): Category => {
  return {
    uuid: node.data.uuid,
    name: node.data.name,
    description: '',
    parentUuid: props.parentUuid || undefined,
    miniature: node.data.miniature,
    image: '',
    order: 0
  }
}

const draggedUuid = ref<string | null>(null)

const onDragStart = (event: any) => {
  draggedUuid.value = props.modelValue[event.oldIndex]?.data.uuid || null
}

const onDragEnd = () => {
  draggedUuid.value = null
}

const isOpen = (uuid: string) => {
  return props.openItems?.includes(uuid) ?? false
}

const toggleNode = (uuid: string) => {
  const currentOpenItems = props.openItems || []
  const newOpenItems = [...currentOpenItems]

  if (newOpenItems.includes(uuid)) {
    newOpenItems.splice(newOpenItems.indexOf(uuid), 1)
  } else {
    newOpenItems.push(uuid)
  }

  emit('update:open-items', newOpenItems)
}
</script>

<style scoped>
.category-item-wrapper {
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
}

.category-item-wrapper:hover {
  background-color: #f9fafb;
}

.expand-button {
  transition: transform 0.2s ease;
}
</style>
