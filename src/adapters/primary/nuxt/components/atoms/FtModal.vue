<template lang="pug">
UModal(v-model="model")
  .p-4
    slot
</template>

<script lang="ts" setup>
const model = defineModel({ type: Boolean })

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [model],
    handler: () => {
      close()
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
