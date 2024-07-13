<template lang="pug">
.category-tree
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
    @view="view"
    @update:open-items="updateOpenItems"
  )
</template>
<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const openItems = ref([])

const expandAll = () => {
  const expandRecursive = (items) => {
    items.forEach((item) => {
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

const updateOpenItems = (newOpenItems) => {
  openItems.value = newOpenItems
}
const emit = defineEmits<{
  (e: 'view', uuid: string): void
  (e: 'update:open-items', items: Array<any>): void
}>()

const view = (uuid: string): void => {
  emit('view', uuid)
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
