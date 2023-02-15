<template lang="pug">
div.flex.justify-between.items-center.py-3.px-3.space-x-3.bg-light.border-b
  button.flex-shrink-0.flex.items-center.justify-center.w-10.h-10.rounded-full(
    type="button"
    value="openSidebar"
    class="md:hidden md:px-6 md:space-x-6 focus:outline-none focus:ring-2 focus:ring-neutral"
    @click="openSidebar"
  )
    icon.icon-md(name="heroicons:bars-3")
  div La nav
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'open-sidebar'): void
}>()

const openSidebar = () => {
  emit('open-sidebar')
}
</script>
