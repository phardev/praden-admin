<template lang="pug">
.ft-input.border-0.bg-default
  label.block.text-sm.font-medium.text-contrast(for='for')
    slot
    span(v-if="required") *
  .mt-1
    slot.block.w-full.rounded-md.border-light.shadow-sm(name="inputField")
      input.block.w-full.rounded-md.border-light.shadow-sm(
        :value="modelValue"
        v-bind="$attrs"
        class='focus:border-default focus:ring-colored sm:text-sm'
        @input="input"
      )
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
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

const emit = defineEmits<{
  (e: 'update:modelValue', input: any): void
}>()

const input = (e: any) => {
  emit('update:modelValue', e.target.value)
}
</script>
