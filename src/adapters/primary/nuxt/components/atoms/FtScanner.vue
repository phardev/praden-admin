<template lang="pug">
UInput.mt-8.w-full.rounded-full.border-opposite(
  v-model="model"
  v-bind="$attrs"
  autofocus
  @keyup.enter="scanned"
)

</template>

<script lang="ts" setup>
const model = defineModel({ type: String })

const emit = defineEmits<{
  (e: 'scanned', value: string): void
}>()

const scanned = () => {
  emit('scanned', model.value)
  model.value = ''
}
</script>
