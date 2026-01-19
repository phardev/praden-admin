<template lang="pug">
div(v-if="isLoading")
  .space-y-6
  .pb-4
    .h-10.bg-gray-200.rounded.animate-pulse
  .pb-4
    .h-10.bg-gray-200.rounded.animate-pulse
  .pb-4
    .h-10.bg-gray-200.rounded.animate-pulse
  .pb-4
    .h-10.bg-gray-200.rounded.animate-pulse
  .pb-4
    .h-10.bg-gray-200.rounded.animate-pulse
.category-tree(v-else)
  .flex.justify-end.mb-2.space-x-4
    ft-button.button-default.mr-0.py-1.px-2.text-md(
      variant="outline"
      @click="expandAll"
    ) Voir tout
      template(#leading)
        icon.icon-md(name="material-symbols:expand-all")
    ft-button.button-default.mr-0.py-1.px-2.text-md(
      variant="outline"
      @click="collapseAll"
    ) Cacher tout
      template(#leading)
        icon.icon-md(name="material-symbols:collapse-all")
  ft-category-tree-node(
    :items="items"
    :open-items="openItems"
    :disabled="disabled"
    :selectable="selectable"
    :selection="selection"
    @selected="selected"
    @view="view"
    @update:open-items="updateOpenItems"
    @toggle-status="toggleStatus"
  )
</template>
<script setup lang="ts">
import type {
  TreeCategoryNodeVM,
  TreeNode
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'
import type { UUID } from '@core/types/types'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  items: {
    type: Array<TreeNode<TreeCategoryNodeVM>>,
    default: () => {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  selectable: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  selection: {
    type: Array<string>,
    default: () => {
      return []
    }
  }
})

const openItems = ref<Array<UUID>>([])

const expandAll = () => {
  const expandRecursive = (
    items: Array<TreeNode<TreeCategoryNodeVM>>
  ): void => {
    items.forEach((item: TreeNode<TreeCategoryNodeVM>) => {
      if (!openItems.value.includes(item.data.uuid)) {
        openItems.value.push(item.data.uuid)
      }
      if (item.children && item.children.length) {
        expandRecursive(item.children)
      }
    })
  }
  expandRecursive(props.items)
}

const collapseAll = () => {
  openItems.value = []
}

const updateOpenItems = (newOpenItems: Array<UUID>): void => {
  openItems.value = newOpenItems
}
const emit = defineEmits<{
  (e: 'view', uuid: string): void
  (e: 'selected', uuid: string): void
  (e: 'update:open-items', items: Array<UUID>): void
  (e: 'toggle-status', uuid: string): void
}>()

const view = (uuid: string): void => {
  emit('view', uuid)
}

const selected = (uuid: string): void => {
  emit('selected', uuid)
}

const toggleStatus = (uuid: string): void => {
  emit('toggle-status', uuid)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
