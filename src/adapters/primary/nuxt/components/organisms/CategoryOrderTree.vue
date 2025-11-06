<template lang="pug">
.space-y-4
  .flex.justify-end.mb-4.space-x-4
    ft-button.button-default.mr-0.py-1.px-2.text-md(
      variant="outline"
      @click="expandAll"
    ) {{ $t('common.expandAll') || 'Voir tout' }}
      template(#leading)
        icon.icon-md(name="material-symbols:expand-all")
    ft-button.button-default.mr-0.py-1.px-2.text-md(
      variant="outline"
      @click="collapseAll"
    ) {{ $t('common.collapseAll') || 'Cacher tout' }}
      template(#leading)
        icon.icon-md(name="material-symbols:collapse-all")

  CategoryOrderTreeLevel(
    v-model="localTree"
    :level="0"
    :parent-uuid="null"
    :open-items="openItems"
    @update:open-items="updateOpenItems"
  )
</template>

<script lang="ts" setup>
import CategoryOrderTreeLevel from '@adapters/primary/nuxt/components/molecules/CategoryOrderTreeLevel.vue'
import type {
  TreeCategoryNodeVM,
  TreeNode
} from '@adapters/primary/view-models/categories/get-categories/getTreeCategoriesVM'

const tree = defineModel<Array<TreeNode<TreeCategoryNodeVM>>>({
  required: true
})

const localTree = computed({
  get: () => tree.value,
  set: (v) => {
    tree.value = v
  }
})

const openItems = ref<Array<string>>([])

const expandAll = () => {
  const expandRecursive = (nodes: Array<TreeNode<TreeCategoryNodeVM>>) => {
    nodes.forEach((node) => {
      if (!openItems.value.includes(node.data.uuid)) {
        openItems.value.push(node.data.uuid)
      }
      if (node.children && node.children.length) {
        expandRecursive(node.children)
      }
    })
  }
  expandRecursive(tree.value)
}

const collapseAll = () => {
  openItems.value = []
}

const updateOpenItems = (newOpenItems: Array<string>) => {
  openItems.value = newOpenItems
}
</script>
