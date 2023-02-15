<template lang="pug">
div.flex.min-h-screen
  mobile-left-side-menu(
    :is-opened="sidebarOpened"
    @close="sidebarOpened = false"
  )
  desktop-left-side-menu
  div.flex-1
    div.flex.justify-between.items-center.py-3.px-3.space-x-3.bg-gray-50.border-b
      button.flex-shrink-0.flex.items-center.justify-center.w-10.h-10.rounded-full(
        type="button"
        value="openSidebar"
        class="md:hidden md:px-6 md:space-x-6 focus:outline-none focus:ring-2 focus:ring-gray-500"
        @click="sidebarOpened = true"
      )
        icon.icon-md(name="heroicons:bars-3")
      div La nav
    main coucou
</template>
<script lang="ts" setup>
const sidebarOpened = ref(false)
</script>
