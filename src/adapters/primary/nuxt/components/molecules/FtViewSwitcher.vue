<template lang="pug">
div.flex.items-center.align-center
  div.px-4.py-2.border.border-default.cursor-pointer(
    v-for="(option, index) in options" :key="index"
    :class="{ 'bg-contrast': option.name === currentView }"
    @click="switchView(option.name)"
  )
    icon.icon-xl.border(:name="option.icon")
</template>

<script setup lang="ts">
defineProps({
  currentView: {
    type: String,
    default: () => {
      return ''
    }
  },
  options: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits<{
  (e: 'switch-view', viewName: string): void
}>()

const switchView = (viewName: string) => {
  emit('switch-view', viewName)
}
</script>

<style lang="css" scoped>
.option {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}
</style>
