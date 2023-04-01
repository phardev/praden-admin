<template lang="pug">
div.flex.min-h-screen
  left-side-menu.no-printme(
    :is-opened="sidebarDialog.isOpened()"
    @close="sidebarDialog.close()"
  )
  div.flex-1
    ft-header.no-printme(@open-sidebar="sidebarDialog.open()")
    main
      slot
</template>
<script lang="ts" setup>
import { useDialog } from '@adapters/primary/nuxt/composables/useDialog'

const sidebarDialog = useDialog()
</script>
