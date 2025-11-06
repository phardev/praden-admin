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
      .category-node-wrapper.mb-2.drag-handle
        .category-item-wrapper.flex.justify-between.items-center.p-2.bg-hover
          .flex.items-center.gap-3.flex-1
            .hamburger-icon.p-2.flex.items-center.flex-shrink-0
              icon.icon-sm(name="i-heroicons-bars-3" class="text-gray-400")
            img.rounded(
              v-if="element.data.miniature"
              :src="element.data.miniature"
              :alt="element.data.name"
              width="40"
              height="40"
            )
            span.font-medium {{ element.data.name }}
          .expand-button.flex.items-center.justify-center.cursor-pointer.p-2.hover_bg-gray-100.rounded(
            v-if="element.children && element.children.length > 0"
            @click.stop="toggleNode(element.data.uuid)"
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
import type {
  TreeCategoryNodeVM,
  TreeNode
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
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
.category-node-wrapper.drag-handle {
  cursor: move;
}

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
  cursor: pointer;
}

.expand-button:hover {
  background-color: #e5e7eb;
}
</style>
