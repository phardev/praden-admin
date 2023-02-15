<template lang="pug">
div.flex.min-h-screen
  left-side-menu(
    :is-opened="sidebarOpened"
    @close="sidebarOpened = false"
  )
  div.flex-1
    ft-header(@open-sidebar="sidebarOpened = true")
    main
      slot
</template>
<script lang="ts" setup>
const sidebarOpened = ref(false)
</script>
