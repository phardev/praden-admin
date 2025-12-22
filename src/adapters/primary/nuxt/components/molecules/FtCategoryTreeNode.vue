<template lang="pug">
  .category-tree-node
    ul
      li(
        v-for="item in items"
        :key="item.data.uuid"
      )
        .list-item(@click="toggle(item)")
          .flex.justify-between.items-center.p-2.cursor-pointer.bg-hover(
            :class="{ 'parent-selected bg-contrast': hasSelectedChild(item) }"
          )
            div.flex.items-center.justify-center.space-x-4
              ft-checkbox(
                v-if="selectable"
                :key="isSelected(item.data.uuid)"
                :indeterminate="isIndeterminate(item)"
                :disabled="disabled"
                :model-value="isSelected(item.data.uuid)"
                @click.stop.prevent="selected(item.data.uuid)"
              )
              img.w-8.h-8(:src="item.data.miniature")
              span {{ item.data.name }}
            div.flex.items-center.justify-center
              icon.icon-md.text-link(
                name="mdi-eye-outline"
                @click.prevent="view(item.data.uuid)"
              ) Voir
              span(
                v-if="item.children.length"
                class="ml-4"
              )
                icon.icon-md(
                  v-if="isOpen(item.data.uuid)"
                  name="material-symbols-light:keyboard-arrow-up"
                )
                icon.icon-md(
                  v-else
                  name="material-symbols-light:keyboard-arrow-down"
                )
        transition(name="slide-fade")
          ul(
            v-if="isOpen(item.data.uuid)"
            class="pl-6"
          )
            FtCategoryTreeNode(
              :items="item.children"
              :open-items="openItems"
              :disabled="disabled"
              :selectable="selectable"
              :selection="selection"
              @view="view"
              @update:open-items="updateOpenItems"
              @selected="selected"
              @clicked.prevent="view"
            )
</template>
<script setup lang="ts">
import FtCheckbox from '@adapters/primary/nuxt/components/atoms/FtCheckbox.vue'

interface CategoryTreeItem {
  data: { uuid: string; name: string; miniature: string }
  children: CategoryTreeItem[]
}

const props = defineProps({
  items: {
    type: Array,
    default: () => {
      return []
    }
  },
  openItems: {
    type: Array,
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

const toggle = (item: CategoryTreeItem) => {
  const uuid = item.data.uuid
  const newOpenItems = [...props.openItems] as string[]
  if (newOpenItems.includes(uuid)) {
    newOpenItems.splice(newOpenItems.indexOf(uuid), 1)
  } else {
    newOpenItems.push(uuid)
  }
  updateOpenItems(newOpenItems)
}

const isSelected = (uuid: string) => props.selection.includes(uuid)

const isOpen = (uuid: string) => props.openItems.includes(uuid)

const emit = defineEmits<{
  (e: 'view', uuid: string): void
  (e: 'selected', uuid: string): void
  (e: 'update:open-items', items: Array<any>): void
}>()

const view = (uuid: string): void => {
  emit('view', uuid)
}

const updateOpenItems = (openItems: Array<any>): void => {
  emit('update:open-items', openItems)
}

const selected = async (uuid: string) => {
  if (!props.disabled) {
    emit('selected', uuid)
  }
}

const isIndeterminate = (item: CategoryTreeItem): boolean => {
  if (item.children.length === 0) return false

  const childIndeterminateStates = item.children.map(
    (child: CategoryTreeItem) => isIndeterminate(child)
  )
  const childSelectedStates = item.children.map((child: CategoryTreeItem) =>
    isSelected(child.data.uuid)
  )

  const hasSelectedChildren = childSelectedStates.some(
    (state: boolean) => state
  )
  const hasUnselectedChildren = childSelectedStates.some(
    (state: boolean) => !state
  )

  return (
    (!isSelected(item.data.uuid) &&
      hasSelectedChildren &&
      hasUnselectedChildren) ||
    childIndeterminateStates.some((state: boolean) => state)
  )
}

const hasSelectedChild = (item: CategoryTreeItem): boolean => {
  if (!item.children || !item.children.length) return false
  return item.children.some(
    (child: CategoryTreeItem) =>
      isSelected(child.data.uuid) || hasSelectedChild(child)
  )
}
</script>

<style scoped>
.parent-selected {
  font-weight: bold;
}

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
