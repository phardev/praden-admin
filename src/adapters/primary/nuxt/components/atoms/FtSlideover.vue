<template lang="pug">
USlideover(v-model="model" side="right" :ui="{ width: 'w-screen max-w-lg' }")
  slot
</template>

<script lang="ts" setup>
import { useModalStack } from '../../composables/useModalStack'

const model = defineModel({ type: Boolean })
const emit = defineEmits<{
  (e: 'close'): void
}>()

const id =
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
const { open, close: closeStack, isTop } = useModalStack(id)

onMounted(() => {
  if (model.value) open()
})
watch(model, (val) => {
  if (val) open()
  else closeStack()
})
onUnmounted(closeStack)

function handleEscape(event?: KeyboardEvent) {
  if (isTop()) {
    event?.stopPropagation()
    emit('close')
  }
}

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [model],
    handler: handleEscape
  }
})
</script>
