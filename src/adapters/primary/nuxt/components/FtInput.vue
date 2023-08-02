<template lang="pug">
.ft-input.border-0.bg-default
  label.block.text-sm.font-medium.text-contrast(for='for')
    slot
    span(v-if="required") *
  .mt-1
    slot.block.w-full.rounded-md.border-light.shadow-sm(name="inputField")
      input.block.w-full.rounded-md.border-light.shadow-sm(v-bind="$attrs" class='focus:border-default focus:ring-colored sm:text-sm')
</template>

<script lang="ts" setup>
defineProps({
  for: {
    type: String,
    default() {
      return ''
    }
  },
  required: {
    type: Boolean,
    default() {
      return false
    }
  }
})
</script>
