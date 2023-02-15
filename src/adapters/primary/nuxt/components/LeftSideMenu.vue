<template lang="pug">
div.flex.min-h-screen
  mobile-left-side-menu(
    :is-opened="isOpened"
    @close="close"
  )
  desktop-left-side-menu
</template>
<script lang="ts" setup>
defineProps({
  isOpened: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>
