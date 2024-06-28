<template lang="pug">
li.cursor-pointer(v-if="node.children.length")
  details(open)
    summary {{ node.data.name }}
    ul(v-for="child in node.children" :key="child.uuid")
      FtTreeNode(:node="child")
li(v-else) {{ node.data.name }}
</template>

<script setup>
defineProps({
  node: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
</script>

<style lang="css" scoped>
li {
  display: block;
  position: relative;
  padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);
  border-left: 2px solid #ddd;
}

ul {
  margin-left: calc(var(--radius) - var(--spacing));
  padding-left: 0;
}

ul li:last-child {
  border-color: transparent;
}

ul li::before {
  content: '';
  display: block;
  position: absolute;
  top: calc(var(--spacing) / -2);
  left: -2px;
  width: calc(var(--spacing) + 2px);
  height: calc(var(--spacing) + 1px);
  border: solid #ddd;
  border-width: 0 0 2px 2px;
}
</style>
