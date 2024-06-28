<template lang="pug">
ul.tree
  FtTreeNode(
    v-for="root in tree"
    :key="root.uuid"
    :node="root"
  )
</template>

<script setup>
import FtTreeNode from '@adapters/primary/nuxt/components/atoms/FtTreeNode.vue'

defineProps({
  tree: {
    type: Array,
    default: () => {
      return []
    }
  }
})
</script>

<style lang="css" scoped>
.tree {
  --spacing: 1.5rem;
  --radius: 10px;
}
</style>
